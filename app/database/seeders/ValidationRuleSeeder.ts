import Seeder from "~/core/Seeder";
import ValidationRuleFactory from "../factories/ValidationRuleFactory";
import { RuleType, type PrismaClient } from "~/generated/prisma/client";

export default class ValidationRuleSeeder extends Seeder {
  async run(client: PrismaClient): Promise<void> {
    const factory = new ValidationRuleFactory(client);
    await factory
      .sequence(Object.values(RuleType).map((name) => ({ name })))
      .create();
  }
}
