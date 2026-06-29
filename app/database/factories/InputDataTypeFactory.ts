import { Factory } from "~/core/Factory";
import type { InputDataTypeUncheckedCreateInput } from "~/generated/prisma/models";

export default class InputDataTypeFactory extends Factory<"inputDataType"> {
  modelName: "inputDataType" = "inputDataType";
  definition(): InputDataTypeUncheckedCreateInput {
    return {
      name: "STRING",
    };
  }
}
