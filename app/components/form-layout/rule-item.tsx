import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemActions } from "../ui/item";
import { Badge } from "../ui/badge";
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
import { data, Form } from "react-router";

export interface RuleItemProps {
  name: string;
  value: any;
  message: string;
  formLayoutId: string;
  fieldId: string;
}

export function RuleItem({
  name,
  value,
  message,
  formLayoutId,
  fieldId,
}: RuleItemProps) {
  return (
    <Item variant={"outline"}>
      <ItemContent>
        <Badge variant={"destructive"}>{name}</Badge>
        <ItemDescription>
          <strong>Error message</strong>: {message}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge className="bg-blue-500">value: {value.toString()}</Badge>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size={"icon-sm"}>
              <X />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this rule ?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Form
                method="DELETE"
                action={`${formLayoutId}/fields/${fieldId}/rules/${name}/delete`}
              >
                <AlertDialogAction variant={"destructive"} type="submit">
                  Delete
                </AlertDialogAction>
              </Form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  );
}
