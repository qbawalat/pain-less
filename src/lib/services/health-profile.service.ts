import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { HealthProfileCreate, HealthProfileResponse, HealthProfileUpdate } from "../../types";
import { ConflictError, NotFoundError } from "../errors";

export class HealthProfileService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async createProfile(data: HealthProfileCreate): Promise<HealthProfileResponse> {
    // Check if profile already exists
    const existingProfile = await this.getProfile();
    if (existingProfile) {
      throw new ConflictError("Health profile already exists");
    }

    const { data: profile, error } = await this.supabase
      .from("health_profiles")
      .insert({
        user_id: this.userId,
        ...data,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.mapToResponse(profile);
  }

  async getProfile(): Promise<HealthProfileResponse | null> {
    const { data: profile, error } = await this.supabase
      .from("health_profiles")
      .select()
      .eq("user_id", this.userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return this.mapToResponse(profile);
  }

  async updateProfile(data: HealthProfileUpdate): Promise<HealthProfileResponse> {
    // Check if profile exists
    const existingProfile = await this.getProfile();
    if (!existingProfile) {
      throw new NotFoundError("Health profile not found");
    }

    const { data: profile, error } = await this.supabase
      .from("health_profiles")
      .update(data)
      .eq("user_id", this.userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.mapToResponse(profile);
  }

  private mapToResponse(profile: Database["public"]["Tables"]["health_profiles"]["Row"]): HealthProfileResponse {
    return {
      id: profile.id,
      birth_date: profile.birth_date,
      height: profile.height,
      weight: profile.weight,
      medical_conditions: profile.medical_conditions,
      family_conditions: profile.family_conditions,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  }
}
