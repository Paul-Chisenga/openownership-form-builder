import prisma from "~/lib/prisma.server";
import type { Route } from "./+types/create";
import { data, useNavigate, useNavigation, useSubmit } from "react-router";
import FormDialog from "~/components/dialogs/FormDialog";
import { InvalidMethodError, ValidationError } from "~/core/errors";
import { validateRequest } from "~/utils/validation.server";
import { useEffect } from "react";
import {
  fieldRuleSchema,
  type FieldRuleSchema,
} from "~/validation/schemas/field-rule";
import { FieldRuleForm } from "~/components/forms/field-rule";
import type { JsonObject } from "@prisma/client/runtime/library";

export async function loader({ params }: Route.LoaderArgs) {
  const field = await prisma.formField.findUniqueOrThrow({
    where: { id: params.fieldId },
  });

  const allowedRulesForFieldDataType = await prisma.validationRule.findMany({
    where: {
      inputDataTypes: {
        some: {
          inputDataTypeId: field.inputDataTypeId,
        },
      },
    },
  });

  return data({
    data: {
      allowedRules: allowedRulesForFieldDataType,
      formLayoutId: params.layoutId,
    },
  });
}

export default function CreateField({
  loaderData: { data },
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useNavigation();

  function handleCreate(data: FieldRuleSchema) {
    submit(data, { method: "POST" });
  }

  const submitting = state === "submitting";

  function back() {
    navigate("/" + data.formLayoutId, { replace: true });
  }

  useEffect(() => {
    if (actionData?.success) {
      back();
    }
  }, [actionData, data.formLayoutId]);

  return (
    <FormDialog<FieldRuleSchema>
      defaultOpen={true}
      onDismiss={back}
      title="Add form field"
      schema={fieldRuleSchema}
      renderForm={(form) => (
        <FieldRuleForm
          form={form}
          fieldPaths={{
            rule: "rule",
            value: "value",
            message: "message",
          }}
          allowedRules={data.allowedRules}
        />
      )}
      defaultValues={{ rule: "", value: "", message: "" }}
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
    const validated = await validateRequest<FieldRuleSchema>(
      request,
      fieldRuleSchema,
    );

    // get field
    const field = await prisma.formField.findUniqueOrThrow({
      where: { id: params.fieldId },
    });

    // get the validation rule
    const validationRule =
      await prisma.validationRuleInInputDataType.findUniqueOrThrow({
        where: {
          inputDataTypeId_validationRuleId: {
            inputDataTypeId: field.inputDataTypeId,
            validationRuleId: validated.rule,
          },
        },
        include: { validationRule: true },
      });

    // validate and parse value type
    let value: number | boolean;
    if (validationRule.validationRule.name === "REQUIRED") {
      const isValidBooleanString =
        validated.value === "true" || validated.value === "false";
      if (!isValidBooleanString) {
        throw new ValidationError({
          value: ["Value must be either true or false"],
        });
      }
      value = validated.value === "true";
    } else if (
      validationRule.validationRule.name === "MIN" ||
      validationRule.validationRule.name === "MAX"
    ) {
      if (isNaN(+validated.value)) {
        throw new ValidationError({ value: ["Value must be a numeric value"] });
      }
      value = +validated.value;
    } else {
      throw new ValidationError({ value: ["Invalid value"] });
    }

    // add rule to field
    await prisma.formField.update({
      where: { id: field.id },
      data: {
        validationRules: {
          ...(field.validationRules as JsonObject),
          [validationRule.validationRule.name]: {
            value,
            message: validated.message,
          },
        },
      },
    });

    return data({ success: true, message: "Field rule added successfully" });
  } catch (error) {
    console.log("Failed to add field rule", error);
    if (error instanceof ValidationError) {
      return error.toResponse();
    }
    return data(
      { success: false, message: "Failed to add field rule" },
      { status: 500 },
    );
  }
}
