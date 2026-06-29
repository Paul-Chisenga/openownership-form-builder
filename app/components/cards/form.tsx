import { useEffect, type PropsWithChildren } from "react";
import { Button } from "../ui/button";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodType } from "zod";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FormCardProps<T extends FieldValues> {
  title: string;
  description?: string;
  renderForm: (form: UseFormReturn<T>) => React.ReactNode;
  schema: ZodType<T, any, any>;
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  resData:
    | {
        success: boolean;
        message: string;
        errors?: Record<string, string[] | undefined>;
      }
    | undefined;
  pending?: boolean;
  onCancel?: () => void;
}

export default function FormCard<T extends FieldValues>({
  title,
  description,
  children,
  renderForm,
  schema,
  defaultValues,
  onSubmit,
  resData,
  pending,
  onCancel,
}: FormCardProps<T> & PropsWithChildren) {
  // form state
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Handle Backend Response
  useEffect(() => {
    if (resData) {
      if (resData.success) {
        toast.success(resData.message);
        form.reset();
      } else {
        toast.error(resData.message);

        // if has validation errors update the form
        if (resData.errors) {
          for (const fieldname in resData.errors) {
            if (!Object.hasOwn(resData.errors, fieldname)) continue;

            const errorMessages = resData.errors[fieldname];
            form.setError(fieldname as Path<T>, {
              message: errorMessages?.[0] || "Invalid value",
            });
          }
        }
      }
    }
  }, [resData]);

  return (
    <form
      className="h-full"
      onSubmit={form.handleSubmit(onSubmit)}
      aria-disabled={pending}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="sm:max-w-xl lg:max-w-xl ">
          {renderForm(form)}
          {children}
        </CardContent>
        <CardFooter className="gap-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            Submit
            {pending && <Spinner />}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
