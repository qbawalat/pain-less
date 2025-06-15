import { test, expect } from "@playwright/test";
import { setupAuthenticatedUser, verifyDashboardComponents } from "./helpers/auth.helper";

// Test credentials
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "";
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || "";

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  throw new Error(
    "Test credentials not found in .env.test file. Please ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set."
  );
}

test.describe("User Flows", () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeAll(async ({}, testInfo) => {
    testInfo.annotations.push({ type: "test_dependencies", description: "e2e/new-user-login.spec.ts" });
  });

  test("verifies dashboard components load", async ({ page }) => {
    const { dashboardPage } = await setupAuthenticatedUser(page);
    await verifyDashboardComponents(page, dashboardPage);
  });

  test("adds and deletes a supplement", async ({ page }) => {
    await setupAuthenticatedUser(page);

    // Step 1: Click add supplement button
    await page.click('[data-testid="add-supplement-button"]');

    // Step 2: Open supplement combobox
    await page.click('button[role="combobox"]');

    // Step 3: Type supplement name
    await page.fill('input[placeholder="Search supplements..."]', "Bug-B-Gone Boost");

    // Step 4: Select or create supplement
    const createOption = await page.$('div[role="option"]:has-text("Create \\"Bug-B-Gone Boost\\"")');
    if (createOption) {
      await createOption.click();
    } else {
      await page.click('div[role="option"]:has-text("Bug-B-Gone Boost")');
    }

    // Step 5: Fill in remaining details
    await page.fill('[data-testid="supplement-dosage-input"]', "500mg");
    await page.click('[data-testid="supplement-frequency-input"]');
    await page.click('div[role="option"]:has-text("Daily")');

    // Step 6: Submit the form
    await page.click('[data-testid="save-supplement-button"]');

    // Step 7: Verify supplement appears in table
    await page.waitForSelector('[data-testid="supplement-item"]');
    const supplementItems = await page.$$('[data-testid="supplement-item"]');
    const supplementNames = await Promise.all(
      supplementItems.map((item) => item.$eval('[data-testid="supplement-name"]', (el) => el.textContent))
    );
    expect(supplementNames).toContain("Bug-B-Gone Boost");

    // Step 8: Click delete button for the supplement
    const supplementItem = await page.$(`[data-testid="supplement-item"][data-name="Bug-B-Gone Boost"]`);
    const deleteButton = await supplementItem?.$('[data-testid="delete-supplement-button"]');
    await deleteButton?.click();

    // Step 9: Verify supplement is removed from table
    await page.waitForSelector(`[data-testid="supplement-item"][data-name="Bug-B-Gone Boost"]`, { state: "detached" });
    const updatedSupplementItems = await page.$$('[data-testid="supplement-item"]');
    const updatedSupplementNames = await Promise.all(
      updatedSupplementItems.map((item) => item.$eval('[data-testid="supplement-name"]', (el) => el.textContent))
    );
    expect(updatedSupplementNames).not.toContain("Bug-B-Gone Boost");
  });
});
