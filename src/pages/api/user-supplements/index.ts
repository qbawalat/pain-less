import type { APIContext } from "astro";
import { UserSupplementService } from "../../../lib/services/user-supplement.service";
import { userSupplementSchema, paginationSchema } from "../../../lib/validation";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import { validate } from "../../../lib/validation";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new UserSupplementService(context.locals.supabase, user.id);

    const url = new URL(context.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;

    const validatedParams = validate(paginationSchema, { page, limit });
    const userSupplements = await service.listUserSupplements({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    return new Response(JSON.stringify(userSupplements), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}

export async function POST(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new UserSupplementService(context.locals.supabase, user.id);

    const body = await context.request.json();
    const validatedData = validate(userSupplementSchema, body);

    const userSupplement = await service.addUserSupplement({
      ...validatedData,
      start_date: validatedData.start_date.toISOString(),
      end_date: validatedData.end_date?.toISOString() || null,
    });

    return new Response(JSON.stringify(userSupplement), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
