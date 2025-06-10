import type { APIContext } from "astro";
import { HealthAlertService } from "../../../lib/services/health-alert.service";
import { paginationSchema } from "../../../lib/validation";
import { handleError } from "../../../lib/errors";
import { requireAuth } from "../../../middleware/auth";
import { validate } from "../../../lib/validation";
import type { AlertStatus } from "../../../types";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new HealthAlertService(context.locals.supabase, user.id);

    const url = new URL(context.request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const status = url.searchParams.get("status") as AlertStatus | undefined;
    const type = url.searchParams.get("type") || undefined;

    const validatedParams = validate(paginationSchema, { page, limit });
    const alerts = await service.listAlerts({
      page: validatedParams.page,
      limit: validatedParams.limit,
      status,
      type,
    });

    return new Response(JSON.stringify(alerts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
