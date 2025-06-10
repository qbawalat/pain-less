import { test, expect } from "@playwright/test";

test.describe("Basic Application Tests", () => {
  test("should load homepage", async ({ page }) => {
    // Increase timeout for this test
    test.setTimeout(30000);

    // Navigate to the page
    await page.goto("/");

    // Wait for the page to be ready
    await page.waitForLoadState("networkidle");

    // Get the actual title for debugging
    const title = await page.title();
    console.log("Page title:", title);

    // Check if the page loaded
    await expect(page).toHaveTitle(/pAIn-less/i, { timeout: 10000 });

    // Check if basic elements are visible
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Find and click login link
    const loginLink = page.locator('a[href*="login"], a[href*="auth"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page.url()).toContain("auth");
    }
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("body")).toBeVisible();
  });
});
