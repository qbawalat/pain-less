import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/db/database.types";
import type {
  UserSupplementCreate,
  UserSupplementResponse,
  PaginationResponse,
  UserSupplementUpdate,
} from "../../types";
import { NotFoundError } from "../errors";

// Type for the joined data from Supabase
type UserSupplementWithJoins = Database["public"]["Tables"]["user_supplements"]["Row"] & {
  supplement: Pick<Database["public"]["Tables"]["supplements"]["Row"], "id" | "name" | "description">;
};

export class UserSupplementService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async listUserSupplements(params: {
    page: number;
    limit: number;
  }): Promise<PaginationResponse<UserSupplementResponse>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const {
      data: userSupplements,
      error,
      count,
    } = await this.supabase
      .from("user_supplements")
      .select(
        `
        *,
        supplement:supplements (
          id,
          name,
          description
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", this.userId)
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      data: userSupplements.map(this.mapToResponse),
      pagination: {
        total: count || 0,
        page,
        limit,
      },
    };
  }

  async addUserSupplement(data: UserSupplementCreate): Promise<UserSupplementResponse> {
    const { data: userSupplement, error } = await this.supabase
      .from("user_supplements")
      .insert({
        user_id: this.userId,
        ...data,
      })
      .select(
        `
        *,
        supplement:supplements (
          id,
          name,
          description
        )
      `
      )
      .single();

    if (error) {
      throw error;
    }

    return this.mapToResponse(userSupplement);
  }

  async bulkAddUserSupplements(data: UserSupplementCreate[]): Promise<UserSupplementResponse[]> {
    const { data: userSupplements, error } = await this.supabase
      .from("user_supplements")
      .insert(
        data.map((item) => ({
          user_id: this.userId,
          ...item,
        }))
      )
      .select(
        `
        *,
        supplement:supplements (
          id,
          name,
          description
        )
      `
      );

    if (error) {
      throw error;
    }

    return userSupplements.map(this.mapToResponse);
  }

  async updateUserSupplement(id: string, data: UserSupplementUpdate): Promise<UserSupplementResponse> {
    const { data: userSupplement, error } = await this.supabase
      .from("user_supplements")
      .update(data)
      .eq("id", id)
      .eq("user_id", this.userId)
      .select(
        `
        *,
        supplement:supplements (
          id,
          name,
          description
        )
      `
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("User supplement not found");
      }
      throw error;
    }

    return this.mapToResponse(userSupplement);
  }

  async deleteUserSupplement(id: string): Promise<void> {
    const { error } = await this.supabase.from("user_supplements").delete().eq("id", id).eq("user_id", this.userId);

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("User supplement not found");
      }
      throw error;
    }
  }

  private mapToResponse(userSupplement: UserSupplementWithJoins): UserSupplementResponse {
    return {
      id: userSupplement.id,
      supplement: {
        id: userSupplement.supplement.id,
        name: userSupplement.supplement.name,
        description: userSupplement.supplement.description,
      },
      start_date: userSupplement.start_date,
      end_date: userSupplement.end_date,
      dosage: userSupplement.dosage,
      frequency: userSupplement.frequency,
    };
  }
}
