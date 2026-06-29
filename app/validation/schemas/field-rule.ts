import * as z from "zod";

export const fieldRuleSchema = z.object({
  rule: z.string().min(2).max(255),
  value: z.string(),
  message: z.string().min(2).max(255),
});

export type FieldRuleSchema = z.infer<typeof fieldRuleSchema>;
