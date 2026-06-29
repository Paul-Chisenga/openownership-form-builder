import { Plus, X } from "lucide-react";
import { data, Form, Link, Outlet, redirect } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import prisma from "~/lib/prisma.server";
import type { Route } from "./+types/layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { FormFieldContent } from "~/components/form-layout/field-content";

export async function loader({ params }: Route.LoaderArgs) {
  const formLayout = await prisma.formLayout.findUniqueOrThrow({
    where: { id: params.layoutId },
    include: {
      fields: { include: { inputDataType: { select: { name: true } } } },
    },
  });

  return data({ data: formLayout });
}

export default function Layout({ loaderData: { data } }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={"/"}>Form Layouts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-2 gap-8">
        {/* Left Panel - Form Builder */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>{data.name}</CardTitle>
            {data.description && (
              <CardDescription>{data.description}</CardDescription>
            )}
            <CardAction>
              <Button variant={"outline"}>Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>
                    <X /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this form ?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form method="DELETE" action={data.id}>
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
            {/* Base info */}
            <Card>
              <CardHeader>
                <CardTitle>Fields</CardTitle>
                <CardAction>
                  <Button size={"icon-sm"} asChild>
                    <Link to={`${data.id}/fields/create`}>
                      <Plus />
                    </Link>
                  </Button>
                </CardAction>
              </CardHeader>
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
              >
                {data.fields.map((field) => (
                  <AccordionItem key={field.id} value={field.id}>
                    <AccordionTrigger className="gap-3 bg-card px-4 rounded-b-none border-b">
                      <Badge className="bg-blue-500">
                        {field.inputDataType.name}
                      </Badge>
                      <span>{field.name}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <FormFieldContent field={field} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </CardContent>
        </Card>
        {/* Right Panel */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
