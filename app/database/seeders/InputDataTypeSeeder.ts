import Seeder from "~/core/Seeder";
import InputDataTypeFactory from "../factories/InputDataTypeFactory";
import type { PrismaClient } from "~/generated/prisma/client";

export default class InputDataTypeSeeder extends Seeder {
  async run(client: PrismaClient): Promise<void> {
    const requiredRule = await client.validationRule.findFirstOrThrow({
      where: { name: "REQUIRED" },
    });
    const minRule = await client.validationRule.findFirstOrThrow({
      where: { name: "MIN" },
    });
    const maxRule = await client.validationRule.findFirstOrThrow({
      where: { name: "MAX" },
    });

    const factory = new InputDataTypeFactory(client);

    // STRING INPUTS
    await factory.create({
      name: "STRING",
      allowedRules: {
        create: [
          { validationRuleId: requiredRule.id },
          { validationRuleId: minRule.id },
          { validationRuleId: maxRule.id },
        ],
      },
    });

    // STRING INPUTS
    await factory.create({
      name: "EMAIL",
      allowedRules: {
        create: [
          { validationRuleId: requiredRule.id },
          { validationRuleId: minRule.id },
          { validationRuleId: maxRule.id },
        ],
      },
    });

    // NUMBER INPUTS
    await factory.create({
      name: "NUMBER",
      allowedRules: {
        create: [
          { validationRuleId: requiredRule.id },
          { validationRuleId: minRule.id },
          { validationRuleId: maxRule.id },
        ],
      },
    });
  }
}
