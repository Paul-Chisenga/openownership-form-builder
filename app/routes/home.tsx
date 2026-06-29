import type { Route } from "./+types/home";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ChevronRightIcon, Plus } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "~/components/ui/item";
import { Badge } from "~/components/ui/badge";
import { data, Link, useNavigation, useSubmit } from "react-router";
import FormDialog from "~/components/dialogs/FormDialog";
import { FormLayoutForm } from "~/components/forms/form-layout";
import {
  formLayoutSchema,
  type FormLayoutSchema,
} from "~/validation/schemas/form-layout";
import { validateRequest } from "~/utils/validation.server";
import { InvalidMethodError, ValidationError } from "~/core/errors";
import prisma from "~/lib/prisma.server";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "~/components/ui/empty";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "OpenOwnership Dynamic Form Builder Engine" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  const forms = await prisma.formLayout.findMany({
    include: { _count: { select: { fields: true } } },
  });

  return data({ data: forms });
}

export default function Home({
  loaderData: { data },
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();
  const { state } = useNavigation();

  function handleCreateFormLayout(data: FormLayoutSchema) {
    submit(data, { method: "POST" });
  }

  const submitting = state === "submitting";

  return (
    <Card className="max-w-4xl bg-transparent">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Form Layouts</CardTitle>
        <CardAction>
          <FormDialog<FormLayoutSchema>
            trigger={
              <Button size={"lg"}>
                <Plus />
                Add form layout
              </Button>
            }
            title="Create form layout"
            schema={formLayoutSchema}
            renderForm={(form) => (
              <FormLayoutForm
                form={form}
                fieldPaths={{ name: "name", description: "description" }}
              />
            )}
            defaultValues={{ name: "", description: "" }}
            onSubmit={handleCreateFormLayout}
            resData={actionData}
            pending={submitting}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="py-8">
        {data.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No data</EmptyTitle>
              <EmptyDescription>No form layout found</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <ItemGroup>
          {data.map((fl) => (
            <Item key={fl.id} variant={"outline"} className="bg-card" asChild>
              <Link key={fl.id} to={fl.id}>
                <ItemContent>
                  <ItemTitle className="text-xl">{fl.name}</ItemTitle>
                  {fl.description && (
                    <ItemDescription>{fl.description}</ItemDescription>
                  )}
                </ItemContent>
                <ItemActions>
                  <Badge variant={"outline"}>{fl._count.fields} fields</Badge>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Link>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    throw new InvalidMethodError();
  }
  try {
    const validated = await validateRequest<FormLayoutSchema>(
      request,
      formLayoutSchema,
    );

    // store the form
    await prisma.formLayout.create({
      data: { name: validated.name, description: validated.description },
    });

    return data({ success: true, message: "Form created successfully" });
  } catch (error) {
    console.log("Failed to create form", error);
    if (error instanceof ValidationError) {
      return error.toResponse();
    }
    return data(
      { success: false, message: "Failed to create form" },
      { status: 500 },
    );
  }
}
