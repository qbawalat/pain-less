import type { APIContext } from "astro";
import { AIService } from "../../../../lib/services/ai.service";
import { HealthAlertService } from "../../../../lib/services/health-alert.service";
import { handleError } from "../../../../lib/errors";
import { requireAuth } from "../../../../middleware/auth";

export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const user = requireAuth(context);
    const aiService = new AIService(context.locals.supabase, user.id);
    const healthAlertService = new HealthAlertService(context.locals.supabase, user.id);

    const analysisResponse = await aiService.generateHealthAnalysis();

    // Filter warning alerts and create them in the database
    const warningAlerts = analysisResponse.analysis.alerts.filter((alert) => alert.type === "warning");

    if (warningAlerts.length > 0) {
      await healthAlertService.bulkCreateAlerts(
        warningAlerts.map((alert) => ({
          alert_type: "warning",
          message: alert.message,
          status: "pending",
        }))
      );
    }

    return new Response(JSON.stringify(analysisResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Health analysis error:", error);
    return handleError(error, context);
  }
}
