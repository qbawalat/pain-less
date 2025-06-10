import { test, expect } from "@playwright/test";

test.describe("Basic Application Tests", () => {
  test("should load homepage", async ({ page }) => {
    await page.goto("/");

    // Sprawdź czy strona się załadowała
    await expect(page).toHaveTitle(/pAIn-less/);

    // Sprawdź czy podstawowe elementy są widoczne
    await expect(page.locator("body")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    // Znajdź i kliknij link do logowania (dostosuj selektor do twojej aplikacji)
    const loginLink = page.locator('a[href*="login"], a[href*="auth"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page.url()).toContain("auth");
    }
  });

  test("should be responsive", async ({ page }) => {
    await page.goto("/");

    // Test responsywności - sprawdź mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("body")).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("body")).toBeVisible();
  });
});
