import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// Log environment variables
console.log("Environment variables loaded:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY);
console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);
console.log("NODE_ENV:", process.env.NODE_ENV);

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    /* Capture screenshot on failure */
    screenshot: "only-on-failure",

    /* Capture video on failure */
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  /* Global teardown to clean up test data */
  globalTeardown: "./src/tests/global-teardown.ts",
});
