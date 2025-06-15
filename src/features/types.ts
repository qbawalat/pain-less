export type FeatureId = "calendar" | "ai_analysis" | "advanced_stats";

// Konfiguracja dla pojedynczej flagi
export interface FeatureConfig {
  enabled: boolean;
  percentage: number;
  forceEnabledUsers: string[];
}

// Typ dla zmiennych środowiskowych związanych z flagami
export interface FeatureFlagsEnv {
  PUBLIC_FEATURE_FLAG_CALENDAR: string;
  PUBLIC_FEATURE_FLAG_CALENDAR_PERCENTAGE?: string;
  PUBLIC_FEATURE_FLAG_CALENDAR_FORCE_ENABLE_FOR_USERS?: string;

  PUBLIC_FEATURE_FLAG_AI_ANALYSIS: string;
  PUBLIC_FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE?: string;
  PUBLIC_FEATURE_FLAG_AI_ANALYSIS_FORCE_ENABLE_FOR_USERS?: string;

  PUBLIC_FEATURE_FLAG_ADVANCED_STATS: string;
  PUBLIC_FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE?: string;
  PUBLIC_FEATURE_FLAG_ADVANCED_STATS_FORCE_ENABLE_FOR_USERS?: string;
}
