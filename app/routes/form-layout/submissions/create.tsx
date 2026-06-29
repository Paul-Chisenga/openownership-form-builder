import prisma from "~/lib/prisma.server";
import type { Route } from "./+types/create";
import { data, useNavigate, useNavigation, useSubmit } from "react-router";
import { validateRequest } from "~/utils/validation.server";
import FormCard from "~/components/cards/form";
import DynamicForm from "~/components/forms/DynamicForm";
import { InvalidMethodError, ValidationError } from "~/core/errors";
import { createDynamicSchema, type FieldConfig } from "~/utils/validation";
import type { JsonObject } from "@prisma/client/runtime/library";
import type { PrimitiveType, RuleType } from "~/generated/prisma/enums";
import { useEffect } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const formLayout = await prisma.formLayout.findUniqueOrThrow({
    where: { id: params.layoutId },
    include: {
      fields: { include: { inputDataType: { select: { name: true } } } },
    },
  });

  return data({ data: { formLayout } });
}

export default function CreateSubmission({
  loaderData: { data },
  actionData,
}: Route.ComponentProps) {
  const fields: FieldConfig[] = data.formLayout.fields.map((field) => ({
    id: field.id,
    name: field.name,
    label: field.label,
    dataType: field.inputDataType.name,
    rules: Object.entries(
      field.validationRules as Record<
        RuleType,
        { value: any; message: string }
      >,
    ).map((rule) => ({
      type: rule[0] as RuleType,
      value: rule[1]!.value,
      message: rule[1]!.message,
    })),
  }));

  const formSchema = createDynamicSchema(fields);

  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();

  function handleSubmit(data: any) {
    submit(data, { method: "POST" });
  }

  function back() {
    navigate("/" + data?.formLayout.id, { replace: true });
  }

  function handleCancel() {
    back();
  }

  useEffect(() => {
    if (actionData?.success) {
      back();
    }
  }, [actionData]);

  return (
    <FormCard
      title="Create Submission"
      description={`Form: ${data.formLayout.name}`}
      schema={formSchema}
      renderForm={(form) => <DynamicForm form={form} fields={fields} />}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      resData={actionData}
      pending={navigation.state === "submitting"}
    />
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "POST") {
    throw new InvalidMethodError();
  }

  const formLayout = await prisma.formLayout.findUniqueOrThrow({
    where: { id: params.layoutId },
    include: {
      fields: { include: { inputDataType: { select: { name: true } } } },
    },
  });

  const fields: FieldConfig[] = formLayout.fields.map((field) => ({
    id: field.id,
    name: field.name,
    label: field.label,
    dataType: field.inputDataType.name,
    rules: Object.entries<any>(field.validationRules as JsonObject).map(
      (rule) => ({
        type: rule[0] as any,
        value: rule[1]!.value,
        message: rule[1]!.message,
      }),
    ),
  }));

  const formSchema = createDynamicSchema(fields);

  try {
    const validated = await validateRequest<Record<string, string>>(
      request,
      formSchema,
    );

    const answers: {
      formFieldId: string;
      fieldName: string;
      fieldLabel: string;
      fieldType: PrimitiveType;
      fieldRules: Record<string, { value: any; message: string }>;
      submittedValue: string;
    }[] = [];

    Object.entries(validated).forEach((submitted) => {
      // get the field
      const field = fields.find((fl) => fl.name === submitted[0]);
      if (!field) {
        throw new Error("Could no proccess request");
      }
      answers.push({
        formFieldId: field.id,
        fieldName: field.name,
        fieldLabel: field.label,
        fieldType: field.dataType,
        fieldRules: field.rules.reduce(
          (prev, cur) => ({
            ...prev,
            [cur.type]: { value: cur.value, message: cur.message },
          }),
          {},
        ),
        submittedValue: submitted[1],
      });
    });

    await prisma.formSubmission.create({
      data: {
        formLayoutId: formLayout.id,
        layoutName: formLayout.name,
        layoutDescription: formLayout.description,
        answers: { create: answers },
      },
    });

    return data({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.log("Failed to submit form", error);
    if (error instanceof ValidationError) {
      return error.toResponse();
    }
    return data(
      { success: false, message: "Failed to submit form" },
      { status: 500 },
    );
  }
}
