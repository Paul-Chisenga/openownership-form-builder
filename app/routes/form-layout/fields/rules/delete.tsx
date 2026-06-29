import { InvalidMethodError } from "~/core/errors";
import type { Route } from "./+types/delete";
import prisma from "~/lib/prisma.server";
import { data, useNavigate } from "react-router";
import { useResponseMessage } from "~/hooks/use-reponse-message";
import { useEffect } from "react";
import type { JsonObject } from "@prisma/client/runtime/library";

export default function DeleteFieldRule({ actionData }: Route.ComponentProps) {
  useResponseMessage(actionData);
  const navigate = useNavigate();

  function back() {
    navigate("/" + actionData?.formLayoutId, { replace: true });
  }

  useEffect(() => {
    if (actionData) {
      back();
    }
  }, [actionData]);

  return null;
}

export async function action({ request, params }: Route.ActionArgs) {
  if (request.method !== "DELETE") {
    throw new InvalidMethodError();
  }
  try {
    const field = await prisma.formField.findUniqueOrThrow({
      where: { id: params.fieldId },
    });
    const newRules = field.validationRules as JsonObject;
    delete newRules[params.ruleId];

    await prisma.formField.update({
      where: { id: params.fieldId },
      data: { validationRules: newRules },
    });

    return {
      success: true,
      message: "Field rule deleted successfully",
      formLayoutId: params.layoutId,
    };
  } catch (error) {
    return data(
      {
        success: false,
        message: "Failed to delete field rule",
        formLayoutId: params.layoutId,
      },
      { status: 500 },
    );
  }
}
