import { Factory } from "~/core/Factory";
import type { FormFieldUncheckedCreateInput } from "~/generated/prisma/models";

export default class FormFieldFactory extends Factory<"formField"> {
  modelName: "formField" = "formField";
  definition(): FormFieldUncheckedCreateInput {
    return {
      name: "firstname",
      label: "First Name",
      validationRules: {},
      formLayoutId: "",
      inputDataTypeId: "",
    };
  }
}
