import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { ValidatedFormComponentProps } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { ValidationRule } from "~/generated/prisma/client";
import type { FieldRuleSchema } from "~/validation/schemas/field-rule";
import { useEffect, useMemo } from "react";

export function FieldRuleForm<T extends FieldValues>({
  form,
  fieldPaths,
  allowedRules,
}: ValidatedFormComponentProps<T, FieldRuleSchema> & {
  allowedRules: ValidationRule[];
}) {
  const selectedRuleId = form.watch(fieldPaths.rule!);
  const selectedRule = useMemo(() => {
    const rule = allowedRules.find((r) => r.id === selectedRuleId);
    switch (rule?.name) {
      case "REQUIRED":
        return { placeholder: "true or false", rule };
      case "MAX":
      case "MIN":
        return { placeholder: "eg. 2", rule };
      default:
        return { placeholder: "Select a rule first", rule };
    }
  }, [selectedRuleId, allowedRules]);

  useEffect(() => {}, [selectedRuleId, allowedRules]);

  return (
    <FieldGroup>
      {fieldPaths.rule && (
        <Controller
          name={fieldPaths.rule}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Validation rule</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger {...field} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select a validation rule" />
                </SelectTrigger>
                <SelectContent>
                  {allowedRules.map((dt) => (
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
      {fieldPaths.value && (
        <Controller
          name={fieldPaths.value}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Value</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type={
                  selectedRule.rule?.name === "REQUIRED" ? "text" : "number"
                }
                aria-invalid={fieldState.invalid}
                placeholder={selectedRule.placeholder}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      )}
      {fieldPaths.message && (
        <Controller
          name={fieldPaths.message}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Error message</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="eg. First Name must be atleast 2 characters long"
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
