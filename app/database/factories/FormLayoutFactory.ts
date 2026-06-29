import { Factory } from "~/core/Factory";
import type { FormLayoutUncheckedCreateInput } from "~/generated/prisma/models";

export default class FormLayoutFactory extends Factory<"formLayout"> {
  modelName: "formLayout" = "formLayout";
  definition(): FormLayoutUncheckedCreateInput {
    return {
      name: "User Registration",
    };
  }
}
