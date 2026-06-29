import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ItemGroup } from "../ui/item";
import { RuleItem } from "./rule-item";
import type { FormField } from "~/generated/prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { data, Form, Link } from "react-router";

export function FormFieldContent({ field }: { field: FormField }) {
  const rules = field.validationRules as Record<
    string,
    { value: any; message: string }
  >;

  return (
    <Card className="rounded-t-none bg-muted ring-0">
      <CardHeader>
        <CardTitle>Rules</CardTitle>
        <CardAction>
          <Button size={"icon-sm"} asChild>
            <Link to={`${field.formLayoutId}/fields/${field.id}/rules/create`}>
              <Plus />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} size={"sm"}>
                <X />
                Delete field
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this field ?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Form
                  method="DELETE"
                  action={`${field.formLayoutId}/fields/${field.id}/delete`}
                >
                  <AlertDialogAction variant={"destructive"} type="submit">
                    Delete
                  </AlertDialogAction>
                </Form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {Object.entries(rules).map(([k, v]) => (
            <RuleItem
              key={k}
              name={k}
              value={v.value}
              message={v.message}
              formLayoutId={field.formLayoutId}
              fieldId={field.id}
            />
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
