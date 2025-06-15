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

    // Ensure end_date is after start_date if provided
    const startDate = new Date(validatedData.start_date);
    const endDate = validatedData.end_date ? new Date(validatedData.end_date) : null;

    if (endDate && endDate <= startDate) {
      return new Response(
        JSON.stringify({
          error: "End date must be after start date",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userSupplement = await service.addUserSupplement({
      ...validatedData,
      start_date: startDate.toISOString(),
      end_date: endDate?.toISOString() || null,
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
