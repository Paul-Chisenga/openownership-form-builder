import z from "zod";
import type { PrimitiveType, RuleType } from "~/generated/prisma/enums";

export interface ValidationRule {
  type: RuleType;
  value: any;
  message: string;
}

export interface FieldConfig {
  id: string;
  name: string;
  label: string;
  dataType: PrimitiveType;
  rules: ValidationRule[];
}

export function createDynamicSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    // Initialize the base Zod type
    let zodChain =
      field.dataType === "STRING"
        ? z.string()
        : field.dataType === "EMAIL"
          ? z.email()
          : z.string();

    // Track if 'required' is explicitly set; default to optional in Zod
    let isRequired = false;

    // Loop through the rules and dynamically chain them
    field.rules.forEach((rule) => {
      const errMsg = rule.message ? { message: rule.message } : undefined;

      switch (rule.type) {
        case "REQUIRED":
          isRequired = true;
          // For strings, ensure it's not just empty spaces
          if (field.dataType === "STRING") {
            zodChain = (zodChain as any).min(1, rule.message || "Required");
          }
          break;

        case "MIN":
          if (field.dataType === "STRING") {
            zodChain = (zodChain as any).min(rule.value, errMsg);
          } else {
            zodChain = (zodChain as any).min(rule.value, errMsg);
          }
          break;

        case "MAX":
          if (field.dataType === "STRING") {
            zodChain = (zodChain as any).max(rule.value, errMsg);
          } else {
            zodChain = (zodChain as any).max(rule.value, errMsg);
          }
          break;
      }
    });

    // 3. If it wasn't marked required, make it optional
    if (!isRequired) {
      zodChain = zodChain.optional().nullable() as any;
    }

    schemaShape[field.name] = zodChain;
  });

  return z.object(schemaShape);
}
