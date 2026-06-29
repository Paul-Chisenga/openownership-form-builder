import * as z from "zod";

export const formFieldSchema = z.object({
  name: z.string().min(2),
  label: z.string().min(2),
  inputDataType: z.string().min(2),
});

export type FormFieldSchema = z.infer<typeof formFieldSchema>;
