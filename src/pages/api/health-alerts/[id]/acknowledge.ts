import type { APIContext } from "astro";
import { HealthAlertService } from "../../../../lib/services/health-alert.service";
import { handleError } from "../../../../lib/errors";
import { requireAuth } from "../../../../middleware/auth";

export const prerender = false;

export async function PUT(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new HealthAlertService(context.locals.supabase, user.id);

    const alertId = context.params.id;
    if (!alertId) {
      return new Response(
        JSON.stringify({
          code: "BAD_REQUEST",
          message: "Alert ID is required",
        }),
        { status: 400 }
      );
    }

    await service.acknowledgeAlert(alertId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error, context);
  }
}
