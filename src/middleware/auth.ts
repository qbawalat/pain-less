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

// Hardcoded user for POC
const POC_USER = {
  id: "b8d7c922-9f3f-4796-9742-b1b39e0ac588",
  email: "diego@gmail.com",
};

export function getCurrentUser(context: APIContext) {
  // TODO: Implement proper JWT validation and session management
  return POC_USER;
}

export function requireAuth(context: APIContext) {
  const user = getCurrentUser(context);
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
