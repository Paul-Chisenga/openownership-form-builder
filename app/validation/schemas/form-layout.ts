import * as z from "zod";

export const formLayoutSchema = z.object({
  name: z.string().min(5, "Form name must be at least 5 characters."),
  description: z.string().optional(),
});

export const formLayoutSchemaDb = z.object({
  name: z.string().min(5, "Form name must be at least 5 characters."),
  description: z.string().min(10),
  demo: z.string().max(10),
  dem: z.string().max(10),
});

export type FormLayoutSchema = z.infer<typeof formLayoutSchema>;
