import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { ValidatedFormComponentProps } from "../types";
import type { FormFieldSchema } from "~/validation/schemas/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { InputDataType } from "~/generated/prisma/client";

export function FormFieldForm<T extends FieldValues>({
  form,
  fieldPaths,
  dataTypes,
}: ValidatedFormComponentProps<T, FormFieldSchema> & {
  dataTypes: InputDataType[];
}) {
  return (
    <FieldGroup>
      {fieldPaths.inputDataType && (
        <Controller
          name={fieldPaths.inputDataType}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Input data Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger {...field} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select the input data type" />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((dt) => (
                    <SelectItem key={dt.id} value={dt.id}>
                      {dt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
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
                placeholder="eg. firstname"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
      {fieldPaths.label && (
        <Controller
          name={fieldPaths.label}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Label</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. First Name"
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
