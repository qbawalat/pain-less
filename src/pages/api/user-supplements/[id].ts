import type { APIContext } from "astro";
import { UserSupplementService } from "../../../lib/services/user-supplement.service";
import { userSupplementSchema } from "../../../lib/validation";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import { validate } from "../../../lib/validation";

export const prerender = false;

export async function PUT(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new UserSupplementService(context.locals.supabase, user.id);

    const id = context.params.id;
    if (!id) {
      return new Response(
        JSON.stringify({
          code: "BAD_REQUEST",
          message: "User supplement ID is required",
        }),
        { status: 400 }
      );
    }

    const body = await context.request.json();
    const validatedData = validate(userSupplementSchema, body);

    const userSupplement = await service.updateUserSupplement(id, validatedData);

    return new Response(JSON.stringify(userSupplement), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}

export async function DELETE(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new UserSupplementService(context.locals.supabase, user.id);

    const id = context.params.id;
    if (!id) {
      return new Response(
        JSON.stringify({
          code: "BAD_REQUEST",
          message: "User supplement ID is required",
        }),
        { status: 400 }
      );
    }

    await service.deleteUserSupplement(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error, context);
  }
}
