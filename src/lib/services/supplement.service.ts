import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { SupplementCreate, SupplementResponse, PaginationResponse } from "../../types";

export class SupplementService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async listSupplements(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<PaginationResponse<SupplementResponse>> {
    const { page, limit, search } = params;
    const offset = (page - 1) * limit;

    let query = this.supabase.from("supplements").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: supplements, error, count } = await query.range(offset, offset + limit - 1).order("name");

    if (error) {
      throw error;
    }

    return {
      data: supplements.map(this.mapToResponse),
      pagination: {
        total: count || 0,
        page,
        limit,
      },
    };
  }

  async createSupplement(data: SupplementCreate): Promise<SupplementResponse> {
    const { data: supplement, error } = await this.supabase.from("supplements").insert(data).select().single();

    if (error) {
      throw error;
    }

    return this.mapToResponse(supplement);
  }

  private mapToResponse(supplement: Database["public"]["Tables"]["supplements"]["Row"]): SupplementResponse {
    return {
      id: supplement.id,
      name: supplement.name,
      description: supplement.description,
      interactions: supplement.interactions,
    };
  }
}
