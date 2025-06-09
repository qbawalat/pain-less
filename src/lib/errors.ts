import type { APIContext } from "astro";

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends Error {
  constructor(
    message = "Validation Error",
    public details?: unknown
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

export function handleError(error: unknown, context: APIContext) {
  console.error("API Error:", {
    error,
    path: context.url.pathname,
    method: context.request.method,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof ValidationError) {
    return new Response(
      JSON.stringify({
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.details,
      } as ErrorResponse),
      { status: 422 }
    );
  }

  if (error instanceof NotFoundError) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND",
        message: error.message,
      } as ErrorResponse),
      { status: 404 }
    );
  }

  if (error instanceof ConflictError) {
    return new Response(
      JSON.stringify({
        code: "CONFLICT",
        message: error.message,
      } as ErrorResponse),
      { status: 409 }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      } as ErrorResponse),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    } as ErrorResponse),
    { status: 500 }
  );
}
