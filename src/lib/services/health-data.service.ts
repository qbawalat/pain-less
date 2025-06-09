import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";

export interface HealthData {
  healthProfile: {
    age: number;
    weight: number;
    height: number;
    medical_conditions: string[] | null;
    family_conditions: string[] | null;
  };
  supplements: {
    name: string;
    dosage: string;
    frequency: string;
    interactions: string[] | null;
  }[];
}

export class HealthDataService {
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly userId: string
  ) {}

  async getUserHealthData(): Promise<HealthData> {
    try {
      // Get health profile
      const { data: healthProfile, error: profileError } = await this.supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", this.userId)
        .single();

      if (profileError) throw profileError;
      if (!healthProfile) throw new Error("Health profile not found");

      // Calculate age from birth_date
      const age = this.calculateAge(new Date(healthProfile.birth_date));

      // Get user's supplements with their details
      const { data: userSupplements, error: supplementsError } = await this.supabase
        .from("user_supplements")
        .select(
          `
          *,
          supplements (
            name,
            interactions
          )
        `
        )
        .eq("user_id", this.userId)
        .is("end_date", null); // Only get active supplements

      if (supplementsError) throw supplementsError;

      // Transform supplements data
      const supplements = userSupplements.map((us) => ({
        name: us.supplements.name,
        dosage: us.dosage,
        frequency: us.frequency,
        interactions: us.supplements.interactions,
      }));

      return {
        healthProfile: {
          age,
          weight: healthProfile.weight,
          height: healthProfile.height,
          medical_conditions: healthProfile.medical_conditions,
          family_conditions: healthProfile.family_conditions,
        },
        supplements,
      };
    } catch (error) {
      console.error("Error fetching health data:", error);
      throw error;
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
