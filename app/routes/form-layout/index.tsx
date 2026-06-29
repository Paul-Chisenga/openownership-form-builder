import { Plus } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "~/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "~/components/ui/item";
import type { Route } from "./+types";
import { redirect, data, Link } from "react-router";
import { InvalidMethodError } from "~/core/errors";
import prisma from "~/lib/prisma.server";
import { useResponseMessage } from "~/hooks/use-reponse-message";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "~/components/ui/empty";

export async function loader({ params }: Route.LoaderArgs) {
  const submissions = await prisma.formSubmission.findMany({
    where: { formLayoutId: params.layoutId },
    include: { answers: true },
  });
  return data({ data: { formLayoutId: params.layoutId, submissions } });
}

export default function FormLayoutDetails({
  loaderData: { data },
  actionData,
}: Route.ComponentProps) {
  useResponseMessage(actionData);

  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
        <CardDescription>Answers submitted for this form</CardDescription>
        <CardAction>
          <Button size={"lg"} asChild>
            <Link to={`/${data.formLayoutId}/submissions/create`}>
              <Plus />
              New Submission
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data.submissions.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No data</EmptyTitle>
              <EmptyDescription>
                No submission found for this form
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <Accordion type="single" collapsible className="flex flex-col gap-2">
          {data.submissions.map((submission) => (
            <AccordionItem key={submission.id} value={submission.id}>
              <AccordionTrigger className="gap-3 bg-card px-4 rounded-b-none border-b">
                <span>
                  Submitted on {new Date(submission.createdAt).toDateString()}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-0 rounded-md rounded-t-none">
                  <CardContent>
                    <ItemGroup>
                      {submission.answers.map((answer) => (
                        <Item
                          key={answer.id}
                          className=" border-x-0 border-t-0 border-b-0 rounded-none not-last:border-b border-border"
                        >
                          <ItemContent className="flex flex-row gap-4">
                            <ItemTitle>{answer.fieldName}</ItemTitle>
                            <ItemDescription>
                              {answer.submittedValue}
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      ))}
                    </ItemGroup>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "DELETE") {
    throw new InvalidMethodError();
  }
  try {
    await prisma.formLayout.delete({ where: { id: params.layoutId } });
    throw redirect("/");
  } catch (error) {
    if (error instanceof Response) throw error;
    return data(
      { success: false, message: "Failed to delete form" },
      { status: 500 },
    );
  }
}
