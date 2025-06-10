import type { APIContext } from "astro";
import { AIService } from "../../../../lib/services/ai.service";
import { handleError } from "../../../../lib/errors";
import { requireAuth } from "../../../../middleware/auth";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const service = new AIService(context.locals.supabase, user.id);

    const plan = await service.generateSupplementPlan();

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return handleError(error, context);
  }
}
