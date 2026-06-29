import { data } from "react-router";

export type ErrorResponsePayload<TErrors = Record<string, unknown>> = {
  success: false;
  message: string;
  errors: TErrors;
};

export type ValidationErrorPayload = Record<string, string[] | undefined>;

export class AppError<
  TErrors extends Record<string, unknown> = Record<string, unknown>,
> extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: TErrors;

  constructor(
    status: number,
    code: string,
    message: string,
    errors: TErrors = {} as TErrors,
  ) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.errors = errors;
  }

  toResponse() {
    return data<ErrorResponsePayload<TErrors>>(
      {
        success: false,
        message: this.message,
        errors: this.errors,
      },
      { status: this.status },
    );
  }
}

export class ValidationError extends AppError<ValidationErrorPayload> {
  constructor(public readonly errors: ValidationErrorPayload) {
    super(
      401,
      "VALIDATION",
      "Validation failed, check your form and try again",
      errors,
    );
  }
}

export class InvalidMethodError extends AppError {
  constructor() {
    super(405, "Method Not Allowed", "Invalid request");
  }
}
