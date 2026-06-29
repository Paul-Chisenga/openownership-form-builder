import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ValidatedFormComponentProps<
  T extends FieldValues,
  U extends FieldValues,
> = {
  form: UseFormReturn<T>;
  fieldPaths: Partial<Record<keyof U, Path<T>>>;
};
