import type { APIContext } from "astro";

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function getCurrentUser(context: APIContext) {
  const user = context.locals.user;

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export function requireAuth(context: APIContext) {
  const user = getCurrentUser(context);
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
