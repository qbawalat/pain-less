import type { APIContext } from "astro";
import { SupplementPlanService } from "@/lib/services/supplement-plan.service";
import { requireAuth } from "@/middleware/auth";
import { handleError } from "@/lib/errors";

export const prerender = false;

export async function POST(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new SupplementPlanService(context.locals.supabase, user.id);

    const plan = await context.request.json();
    await service.approveSupplementPlan(plan);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
