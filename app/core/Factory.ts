import type { PrismaClient } from "~/generated/prisma/client";

type Sequence = { index: number };

export abstract class Factory<
  T extends {
    [K in keyof PrismaClient]: PrismaClient[K] extends {
      create: (args: any) => any;
    }
      ? K
      : never;
  }[keyof PrismaClient],
  CreateArgs = PrismaClient[T] extends { create: (args: infer CA) => any }
    ? CA
    : never,
  CreateResult = PrismaClient[T] extends { create: (args: any) => infer CR }
    ? Awaited<CR>
    : never,
  CreateInput = CreateArgs extends { data: infer CI } ? CI : never,
> {
  // the name of the model this factory creates
  abstract modelName: T;

  // fine data array for creating instances in a specific sequence, if needed
  private data: CreateInput[] = [];

  constructor(private databaseClient: PrismaClient) {}

  // the default data for creating an instance, can be overridden by passing data to create()
  abstract definition(): CreateInput;

  // the method to set how many instances to create, returns this for chaining
  count(c: number) {
    if (!Number.isInteger(c) || c <= 0) {
      throw new Error(
        `Factory.count() expects a positive integer. Received: ${c}`,
      );
    }

    const existingData = [...this.data];
    this.data = [];

    for (let i = 0; i < c; i++) {
      if (existingData[i]) {
        this.data.push(existingData[i]);
      } else {
        const defaults = this.definition();
        this.data.push(defaults);
      }
    }

    return this;
  }

  private async execute(data?: Partial<CreateInput>): Promise<CreateResult[]> {
    console.log(`Creating ${this.data.length} ${this.modelName}(s)...`);

    const results: CreateResult[] = [];

    // create the specified number of instances, merging the default definition with any provided data
    for (let i = 0; i < this.data.length; i++) {
      const result = await (this.databaseClient[this.modelName] as any).create({
        data: { ...this.data[i], ...(data ?? {}) },
      });
      console.log(`Created ${this.modelName} with ID: ${result.id}`);
      results.push(result);
    }

    return results;
  }

  async create(data?: Partial<CreateInput>): Promise<CreateResult[]> {
    // Default to creating 1 entry if no count() or sequence() was called
    if (this.data.length === 0) {
      this.data.push({ ...this.definition(), ...data });
    }
    // if a transaction client was provided, use it, otherwise create a new transaction for this operation
    try {
      return await this.execute(data);
    } finally {
      this.data = [];
    }
  }

  sequence(items: Partial<CreateInput>[]): this;
  sequence(...items: Partial<CreateInput>[]): this;
  sequence(fn: (seq: Sequence) => Partial<CreateInput>): this;
  sequence(
    itemsOrFn:
      | Partial<CreateInput>[]
      | Partial<CreateInput>
      | ((seq: Sequence) => Partial<CreateInput>),
    ...rest: Partial<CreateInput>[]
  ): this {
    let items: Partial<CreateInput>[];
    // If the first argument is a function, call it once per existing entry in this.data
    if (typeof itemsOrFn === "function" && !Array.isArray(itemsOrFn)) {
      items = [];
      for (let i = 0; i < this.data.length; i++) {
        items.push(
          (itemsOrFn as (seq: Sequence) => Partial<CreateInput>)({ index: i }),
        );
      }
    }
    // If the first argument is an array, use it directly
    else if (Array.isArray(itemsOrFn)) {
      items = itemsOrFn;
    }
    // If variadic args, combine first arg with rest
    else {
      items = [itemsOrFn, ...rest];
    }

    // If this.data is empty, initialize it and merge with the sequence items
    if (this.data.length === 0) {
      this.data = items.map((item) => ({ ...this.definition(), ...item }));
    } else {
      // Merge each item in the sequence into this.data
      this.data.forEach((item, index) => {
        if (items[index]) {
          this.data[index] = { ...item, ...items[index] };
        }
      });
    }

    return this;
  }
}
