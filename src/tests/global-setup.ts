import { FullConfig } from "@playwright/test";
import { resolve } from "path";

async function globalSetup(config: FullConfig) {
  // Load test environment variables
  config({
    path: resolve(process.cwd(), ".env.test"),
    override: true,
  });

  // Verify required environment variables
  const requiredEnvVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_KEY", "TEST_USER_EMAIL", "TEST_USER_PASSWORD"];

  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }

  // You can add more setup logic here, such as:
  // - Database seeding
  // - Test user creation
  // - Environment configuration
  // - API mocking setup
}

export default globalSetup;
