import { Page, expect } from "@playwright/test";
import { LoginPage } from "@/tests/pages/LoginPage";
import { MainDashboardPage } from "@/tests/pages/MainDashboardPage";

// Test credentials
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || "";

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  throw new Error(
    "Test credentials not found in .env.test file. Please ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set."
  );
}

export interface AuthResult {
  loginPage: LoginPage;
  dashboardPage: MainDashboardPage;
}

/**
 * Helper function to setup authenticated user with profile
 * @param page Playwright page object
 * @returns Object containing initialized page objects
 */
export async function setupAuthenticatedUser(page: Page): Promise<AuthResult> {
  const loginPage = new LoginPage(page);
  const dashboardPage = new MainDashboardPage(page);

  try {
    // Login
    await loginPage.navigate();
    await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    // Wait for all skeletons to disappear (indicating profile fetch is complete)
    await Promise.all([
      page.waitForSelector('[data-testid="health-stats-skeleton"]', { state: "hidden", timeout: 5000 }),
      page.waitForSelector('[data-testid="calendar-skeleton"]', { state: "hidden", timeout: 5000 }),
      page.waitForSelector('[data-testid="supplement-list-skeleton"]', { state: "hidden", timeout: 5000 }),
      page.waitForSelector('[data-testid="alert-system-skeleton"]', { state: "hidden", timeout: 5000 }),
    ]);

    // Wait for dashboard to be fully loaded with all components
    await dashboardPage.waitForDashboard();
    await page.waitForSelector('[data-testid="add-supplement-button"]', { state: "visible", timeout: 5000 });
    await page.waitForSelector("table", { state: "visible", timeout: 5000 });
    await page.waitForSelector('[data-testid="alert-system"]', { state: "visible", timeout: 5000 });
    // disabling calendar widget as it's randomized via feature flag %
    // await page.waitForSelector('[data-testid="calendar-widget"]', { state: "visible", timeout: 5000 });

    return { loginPage, dashboardPage };
  } catch (error) {
    throw new Error(`Failed to setup authenticated user: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Helper function to verify dashboard components
 * @param page Playwright page object
 * @param dashboardPage MainDashboardPage instance
 */
export async function verifyDashboardComponents(page: Page, dashboardPage: MainDashboardPage): Promise<void> {
  expect(await dashboardPage.isDashboardVisible()).toBeTruthy();
  expect(await page.isVisible('[data-testid="add-supplement-button"]')).toBeTruthy();
  expect(await page.isVisible("table")).toBeTruthy();
  expect(await page.isVisible('[data-testid="alert-system"]')).toBeTruthy();
  // await page.waitForSelector('[data-testid="calendar-widget"]', { state: "visible", timeout: 5000 });
  // expect(await page.isVisible('[data-testid="calendar-widget"]')).toBeTruthy();
}
