import { InvalidMethodError } from "~/core/errors";
import type { Route } from "./+types/delete";
import prisma from "~/lib/prisma.server";
import { data, useNavigate } from "react-router";
import { useResponseMessage } from "~/hooks/use-reponse-message";
import { useEffect } from "react";

export default function DeleteFormField({ actionData }: Route.ComponentProps) {
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
    await prisma.formField.delete({
      where: { id: params.fieldId },
    });
    return {
      success: true,
      message: "Field deleted successfully",
      formLayoutId: params.layoutId,
    };
  } catch (error) {
    return data(
      {
        success: false,
        message: "Failed to delete field",
        formLayoutId: params.layoutId,
      },
      { status: 500 },
    );
  }
}
