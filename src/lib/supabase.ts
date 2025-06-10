import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Astro.locals
declare module "astro" {
  interface Locals {
    supabase: SupabaseClient;
    user: User | null;
  }
}

// User type
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
