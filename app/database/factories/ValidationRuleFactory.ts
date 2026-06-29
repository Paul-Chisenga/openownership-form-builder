import { Factory } from "~/core/Factory";
import type { ValidationRuleUncheckedCreateInput } from "~/generated/prisma/models";

export default class ValidationRuleFactory extends Factory<"validationRule"> {
  modelName: "validationRule" = "validationRule";
  definition(): ValidationRuleUncheckedCreateInput {
    return {
      name: "REQUIRED",
    };
  }
}
