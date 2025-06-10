import { test, expect } from "@playwright/test";
import { LoginPage } from "@/tests/pages/LoginPage";
import { MainDashboardPage } from "@/tests/pages/MainDashboardPage";
import { CreateHealthProfilePage } from "@/tests/pages/CreateHealthProfilePage";

// Load test environment variables
// dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

// Test credentials
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  throw new Error(
    "Test credentials not found in .env.test file. Please ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set."
  );
}

test.describe("New User Login Flow", () => {
  test("should create health profile after successful login", async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new MainDashboardPage(page);
    const healthProfilePage = new CreateHealthProfilePage(page);

    // Step 1: Navigate to login page and verify it's visible
    await loginPage.navigate();
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();

    // Step 2: Fill in login credentials
    await loginPage.login(TEST_USER_EMAIL, TEST_USER_PASSWORD);

    // Step 3: Verify we're redirected to create profile page
    await dashboardPage.waitForCreateProfile();
    expect(await dashboardPage.isCreateProfileVisible()).toBeTruthy();
    expect(await healthProfilePage.isFormVisible()).toBeTruthy();

    // Step 4: Fill in health profile information
    await healthProfilePage.fillBasicInfo("1990-01-01", 180, 75);

    // Step 5: Add some medical conditions
    await healthProfilePage.addSuggestedCondition("Eye strain");
    await healthProfilePage.addSuggestedCondition("Back pain");
    await healthProfilePage.addMedicalCondition("Custom condition");

    // Step 6: Add family history
    await healthProfilePage.addFamilyCondition("Diabetes");
    await healthProfilePage.addFamilyCondition("Heart disease");

    // Step 7: Verify conditions were added correctly
    const medicalConditions = await healthProfilePage.getSelectedMedicalConditions();
    expect(medicalConditions).toContain("Eye strain");
    expect(medicalConditions).toContain("Back pain");
    expect(medicalConditions).toContain("Custom condition");

    const familyConditions = await healthProfilePage.getSelectedFamilyConditions();
    expect(familyConditions).toContain("Diabetes");
    expect(familyConditions).toContain("Heart disease");

    // Step 8: Submit the form
    await healthProfilePage.submit();

    // Step 9: Verify we're redirected to the main dashboard
    await dashboardPage.waitForDashboard();
    expect(await dashboardPage.isDashboardVisible()).toBeTruthy();
    expect(await dashboardPage.isCreateProfileVisible()).toBeFalsy();
  });

  test("should handle invalid login credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new MainDashboardPage(page);

    // Step 1: Navigate to login page
    await loginPage.navigate();

    // Step 2: Try to login with invalid credentials
    await loginPage.login("invalid@email.com", "wrongpassword");

    // Step 3: Verify we're still on the login page
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    expect(await dashboardPage.isDashboardVisible()).toBeFalsy();
  });
});
