import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { FormLayoutSchema } from "~/validation/schemas/form-layout";
import type { ValidatedFormComponentProps } from "../types";

export function FormLayoutForm<T extends FieldValues>({
  form,
  fieldPaths,
}: ValidatedFormComponentProps<T, FormLayoutSchema>) {
  return (
    <FieldGroup>
      {fieldPaths.name && (
        <Controller
          name={fieldPaths.name}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. User Registration"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
      {fieldPaths.description && (
        <Controller
          name={fieldPaths.description}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Description (optional)
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
    </FieldGroup>
  );
}
