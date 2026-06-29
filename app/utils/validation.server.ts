import type { FieldValues } from "react-hook-form";
import { flattenError, ZodError, type ZodType } from "zod";
import { ValidationError } from "~/core/errors";

/**
 * Validates formdata on the server
 *
 * @param request
 * @param schema
 * @returns
 */
export async function validateRequest<T extends FieldValues>(
  request: Request,
  schema: ZodType<T, any, any>,
) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  // Validation
  const validated = schema.safeParse(payload);

  if (!validated.success && validated.error instanceof ZodError) {
    const flattened = flattenError(validated.error);
    throw new ValidationError(flattened.fieldErrors);
  }

  return validated.data as T;
}
