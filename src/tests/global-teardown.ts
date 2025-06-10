import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  // Clean up test environment
  // You can add cleanup logic here, such as:
  // - Database cleanup
  // - Test user deletion
  // - Temporary file removal
  // - API mock cleanup
}

export default globalTeardown;
