import Seeder from "~/core/Seeder";
import FormFieldFactory from "../factories/FormFieldFactory";
import type { PrismaClient } from "~/generated/prisma/client";
import { RuleType } from "~/generated/prisma/enums";

export default class FormFieldSeeder extends Seeder {
  async run(client: PrismaClient): Promise<void> {
    // form layout
    const formLayout = await client.formLayout.findFirstOrThrow();

    // string input data type
    const stringDataType = await client.inputDataType.findFirstOrThrow({
      where: { name: "STRING" },
    });
    const emailDataType = await client.inputDataType.findFirstOrThrow({
      where: { name: "EMAIL" },
    });

    // First Name
    await new FormFieldFactory(client).create({
      name: "firstname",
      label: "First Name",
      formLayoutId: formLayout.id,
      inputDataTypeId: stringDataType.id,
      validationRules: {
        [RuleType.REQUIRED]: { value: true, message: "First name is required" },
        [RuleType.MIN]: { value: 2, message: "Too short" },
        [RuleType.MAX]: { value: 255, message: "Too long" },
      },
    });

    // Last Name
    await new FormFieldFactory(client).create({
      name: "lastname",
      label: "Last Name",
      formLayoutId: formLayout.id,
      inputDataTypeId: stringDataType.id,
      validationRules: {
        [RuleType.REQUIRED]: { value: true, message: "Last name is required" },
        [RuleType.MIN]: { value: 2, message: "Too short" },
        [RuleType.MAX]: { value: 255, message: "Too long" },
      },
    });

    // Email
    await new FormFieldFactory(client).create({
      name: "email",
      label: "Email",
      formLayoutId: formLayout.id,
      inputDataTypeId: emailDataType.id,
      validationRules: {
        [RuleType.REQUIRED]: { value: true, message: "First name is required" },
        [RuleType.MIN]: { value: 2, message: "Too short" },
        [RuleType.MAX]: { value: 255, message: "Too long" },
      },
    });
  }
}
