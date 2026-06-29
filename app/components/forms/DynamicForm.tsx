import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import type { FieldConfig } from "~/utils/validation";
import { Input } from "../ui/input";

interface DynamicFormProps {
  form: UseFormReturn<any>;
  fields: FieldConfig[];
}

export default function DynamicForm({ form, fields }: DynamicFormProps) {
  return (
    <FieldGroup>
      {fields.map((fld) => (
        <Controller
          key={fld.id}
          name={fld.name}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{fld.label}</FieldLabel>
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
      ))}
    </FieldGroup>
  );
}
