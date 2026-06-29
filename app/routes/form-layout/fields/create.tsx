import prisma from "~/lib/prisma.server";
import type { Route } from "./+types/create";
import { data, useNavigate, useNavigation, useSubmit } from "react-router";
import FormDialog from "~/components/dialogs/FormDialog";
import {
  formFieldSchema,
  type FormFieldSchema,
} from "~/validation/schemas/form-field";
import { FormFieldForm } from "~/components/forms/form-field";
import { InvalidMethodError, ValidationError } from "~/core/errors";
import { validateRequest } from "~/utils/validation.server";
import { useEffect } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const inputDataTypes = await prisma.inputDataType.findMany();

  return data({ data: { inputDataTypes, formLayoutId: params.layoutId } });
}

export default function CreateField({
  loaderData: { data },
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useNavigation();

  function handleCreate(data: FormFieldSchema) {
    submit(data, { method: "POST" });
  }

  function back() {
    navigate("/" + data.formLayoutId, { replace: true });
  }

  const submitting = state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      back();
    }
  }, [actionData]);

  return (
    <FormDialog<FormFieldSchema>
      defaultOpen={true}
      onDismiss={back}
      title="Add form field"
      schema={formFieldSchema}
      renderForm={(form) => (
        <FormFieldForm
          form={form}
          fieldPaths={{
            name: "name",
            label: "label",
            inputDataType: "inputDataType",
          }}
          dataTypes={data.inputDataTypes}
        />
      )}
      defaultValues={{ name: "", label: "", inputDataType: "" }}
      onSubmit={handleCreate}
      resData={actionData}
      pending={submitting}
    />
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "POST") {
    throw new InvalidMethodError();
  }
  try {
    const validated = await validateRequest<FormFieldSchema>(
      request,
      formFieldSchema,
    );

    // store the field
    const formLayout = await prisma.formLayout.findUniqueOrThrow({
      where: { id: params.layoutId },
    });
    const dataType = await prisma.inputDataType.findUniqueOrThrow({
      where: { id: validated.inputDataType },
    });
    await prisma.formField.create({
      data: {
        name: validated.name,
        label: validated.label,
        formLayoutId: formLayout.id,
        inputDataTypeId: dataType.id,
        validationRules: {},
      },
    });

    return data({ success: true, message: "Field added successfully" });
  } catch (error) {
    console.log("Failed to create field", error);
    if (error instanceof ValidationError) {
      return error.toResponse();
    }
    return data(
      { success: false, message: "Failed to create field" },
      { status: 500 },
    );
  }
}
