import type { Database } from "./db/database.types";

// Health Profile DTOs
export type HealthProfileResponse = Pick<
  Database["public"]["Tables"]["health_profiles"]["Row"],
  "id" | "birth_date" | "height" | "weight" | "medical_conditions" | "family_conditions" | "created_at" | "updated_at"
>;

export type HealthProfileUpdate = Pick<
  Database["public"]["Tables"]["health_profiles"]["Insert"],
  "birth_date" | "height" | "weight" | "medical_conditions" | "family_conditions"
>;

// Supplement DTOs
export type SupplementResponse = Pick<
  Database["public"]["Tables"]["supplements"]["Row"],
  "id" | "name" | "description" | "interactions"
>;

export type SupplementCreate = Pick<
  Database["public"]["Tables"]["supplements"]["Insert"],
  "name" | "description" | "interactions"
>;

// User Supplement DTOs
export interface UserSupplementResponse {
  id: string;
  supplement: Pick<Database["public"]["Tables"]["supplements"]["Row"], "id" | "name" | "description">;
  start_date: string;
  end_date: string | null;
  dosage: string;
  frequency: string;
}

export type UserSupplementCreate = Pick<
  Database["public"]["Tables"]["user_supplements"]["Insert"],
  "supplement_id" | "start_date" | "end_date" | "dosage" | "frequency"
>;

export type UserSupplementUpdate = UserSupplementCreate;

// Health Alert DTOs
export type HealthAlertResponse = Pick<
  Database["public"]["Tables"]["health_alerts"]["Row"],
  "id" | "alert_type" | "message" | "status" | "created_at"
>;

export type HealthAlertAcknowledge = Pick<Database["public"]["Tables"]["health_alerts"]["Update"], "status">;

// AI-Powered DTOs
export interface SupplementPlanResponse {
  plan: {
    recommendations: {
      supplement_id: string;
      confidence_score: number;
      reasoning: string;
      potential_interactions: string[];
    }[];
    generated_at: string;
  };
}

export interface HealthAnalysisResponse {
  analysis: {
    alerts: {
      type: "warning" | "info";
      message: string;
      confidence_score: number;
    }[];
    generated_at: string;
  };
}

// Pagination DTOs
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// Common types
export type AlertType = "warning" | "info";
export type AlertStatus = "pending" | "acknowledged";
