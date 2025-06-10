import { createClient } from "@supabase/supabase-js";

async function globalTeardown() {
  console.log("Starting global teardown...");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  const e2eUserId = process.env.TEST_USER_UID;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials:");
    console.error("SUPABASE_URL:", supabaseUrl ? "present" : "missing");
    console.error("SUPABASE_SERVICE_KEY:", supabaseServiceKey ? "present" : "missing");
    throw new Error("Missing Supabase credentials");
  }

  console.log("Initializing Supabase client with service role...");
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // List of tables to clean up (excluding auth.users)
  const tablesToClean = ["health_profiles"];
  // const tablesToClean = ["health_profiles", "health_alerts", "user_supplements"];

  for (const table of tablesToClean) {
    try {
      console.log(`Cleaning table ${table}...`);
      const { error } = await supabase.from(table).delete().eq("user_id", e2eUserId);

      if (error) {
        console.error(`Error cleaning table ${table}:`, error);
        throw error; // Re-throw to ensure we know if cleanup failed
      } else {
        console.log(`Successfully cleaned table ${table}`);
      }
    } catch (error) {
      console.error(`Failed to clean table ${table}:`, error);
      throw error; // Re-throw to ensure we know if cleanup failed
    }
  }

  console.log("Global teardown completed successfully");
}

export default globalTeardown;
