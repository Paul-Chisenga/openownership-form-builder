import { useEffect, useState, type PropsWithChildren } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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

interface FormDialogProps<T extends FieldValues> {
  trigger?: React.ReactNode;
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
  defaultOpen?: boolean;
  onDismiss?: () => void;
}

export default function FormDialog<T extends FieldValues>({
  trigger,
  title,
  description,
  children,
  renderForm,
  schema,
  defaultValues,
  onSubmit,
  resData,
  pending,
  defaultOpen = false,
  onDismiss,
}: FormDialogProps<T> & PropsWithChildren) {
  // dialog state
  const [open, setOpen] = useState(defaultOpen);

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
        setOpen(false);
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
    <Dialog
      open={defaultOpen || open}
      onOpenChange={(newState) => {
        setOpen(newState);
        if (defaultOpen || !newState) {
          onDismiss?.();
        }
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-xl lg:max-w-xl ">
        <form
          className="h-full"
          onSubmit={form.handleSubmit(onSubmit)}
          aria-disabled={pending}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 no-scrollbar max-h-[80vh] overflow-y-auto px-4 py-6">
            {renderForm(form)}
            {children}
          </div>
          <DialogFooter>
            <DialogClose asChild disabled={pending}>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Submit
              {pending && <Spinner />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
