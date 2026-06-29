import type { PrismaClient } from "~/generated/prisma/client";

export default abstract class Seeder {
  protected seederChunks: Seeder[][] = [];

  constructor() {}

  abstract run(client: PrismaClient): Promise<void>;

  async call(client: any, seeder: Seeder | Seeder[]): Promise<void> {
    if (Array.isArray(seeder)) {
      for (const s of seeder) {
        await s.run(client);
      }
    } else {
      await seeder.run(client);
    }
  }
}
