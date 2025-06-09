import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { HealthAlertResponse, PaginationResponse, AlertStatus } from "../../types";

export class HealthAlertService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async listAlerts(params: {
    page: number;
    limit: number;
    status?: AlertStatus;
    type?: string;
  }): Promise<PaginationResponse<HealthAlertResponse>> {
    const { page, limit, status, type } = params;
    const offset = (page - 1) * limit;

    let query = this.supabase.from("health_alerts").select("*", { count: "exact" }).eq("user_id", this.userId);

    if (status) {
      query = query.eq("status", status);
    }

    if (type) {
      query = query.eq("alert_type", type);
    }

    const {
      data: alerts,
      error,
      count,
    } = await query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: alerts.map(this.mapToResponse),
      pagination: {
        total: count || 0,
        page,
        limit,
      },
    };
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const { error } = await this.supabase
      .from("health_alerts")
      .update({ status: "acknowledged" })
      .eq("id", alertId)
      .eq("user_id", this.userId);

    if (error) {
      throw error;
    }
  }

  private mapToResponse(alert: Database["public"]["Tables"]["health_alerts"]["Row"]): HealthAlertResponse {
    return {
      id: alert.id,
      alert_type: alert.alert_type,
      message: alert.message,
      status: alert.status,
      created_at: alert.created_at,
    };
  }
}
