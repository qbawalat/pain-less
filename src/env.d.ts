/// <reference types="astro/client" />

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "./db/database.types";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user: User | null;
    }
  }
}

interface ImportMetaEnv {
  // Feature Flags
  readonly FEATURE_FLAG_CALENDAR: string;
  readonly FEATURE_FLAG_CALENDAR_PERCENTAGE?: string;
  readonly FEATURE_FLAG_CALENDAR_FORCE_ENABLE_FOR_USERS?: string;

  readonly FEATURE_FLAG_AI_ANALYSIS: string;
  readonly FEATURE_FLAG_AI_ANALYSIS_PERCENTAGE?: string;
  readonly FEATURE_FLAG_AI_ANALYSIS_FORCE_ENABLE_FOR_USERS?: string;

  readonly FEATURE_FLAG_ADVANCED_STATS: string;
  readonly FEATURE_FLAG_ADVANCED_STATS_PERCENTAGE?: string;
  readonly FEATURE_FLAG_ADVANCED_STATS_FORCE_ENABLE_FOR_USERS?: string;

  // Supabase
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly SUPABASE_SERVICE_KEY: string;

  // Application
  readonly PUBLIC_APP_URL: string;
  readonly PUBLIC_API_URL: string;
  readonly NODE_ENV: "development" | "production" | "e2e";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
