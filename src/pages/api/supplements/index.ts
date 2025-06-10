import type { APIContext } from "astro";
import { SupplementService } from "../../../lib/services/supplement.service";
import { supplementSchema, paginationSchema } from "../../../lib/validation";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import { validate } from "../../../lib/validation";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new SupplementService(context.locals.supabase, user.id);

    const url = new URL(context.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const search = url.searchParams.get("search") || undefined;

    const validatedParams = validate(paginationSchema, { page, limit });
    const supplements = await service.listSupplements({
      page: validatedParams.page,
      limit: validatedParams.limit,
      search,
    });

    return new Response(JSON.stringify(supplements), {
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
    const service = new SupplementService(context.locals.supabase, user.id);

    const body = await context.request.json();
    const validatedData = validate(supplementSchema, body);

    const supplement = await service.createSupplement(validatedData);

    return new Response(JSON.stringify(supplement), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
