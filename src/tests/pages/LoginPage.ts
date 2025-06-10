import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Selectors
  private readonly emailInput = '[data-testid="login-email-input"]';
  private readonly passwordInput = '[data-testid="login-password-input"]';
  private readonly submitButton = '[data-testid="login-submit-button"]';
  private readonly form = '[data-testid="login-form"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto("/auth/login");
    // Wait for React to hydrate
    await this.page.waitForLoadState("networkidle");
    await this.waitForSelector(this.form);
  }

  async login(email: string, password: string) {
    // Wait for form to be ready and React to hydrate
    await this.page.waitForLoadState("networkidle");
    await this.waitForSelector(this.form);

    // Wait for inputs to be ready and visible
    await this.page.waitForSelector(this.emailInput, { state: "visible" });
    await this.page.waitForSelector(this.passwordInput, { state: "visible" });

    // Type values instead of fill to trigger React events
    await this.page.type(this.emailInput, email);
    await this.page.type(this.passwordInput, password);

    // Wait for submit button to be ready
    await this.page.waitForSelector(this.submitButton, { state: "visible" });

    // Click submit
    await this.page.click(this.submitButton);

    // Wait for navigation
    await this.page.waitForLoadState("networkidle");
  }

  async isLoginFormVisible() {
    return await this.isVisible(this.form);
  }

  async getEmailInputValue() {
    await this.waitForSelector(this.emailInput);
    return await this.page.inputValue(this.emailInput);
  }

  async getPasswordInputValue() {
    await this.waitForSelector(this.passwordInput);
    return await this.page.inputValue(this.passwordInput);
  }

  async waitForForm() {
    await this.waitForSelector(this.form);
    await this.page.waitForSelector(this.emailInput, { state: "visible" });
    await this.page.waitForSelector(this.passwordInput, { state: "visible" });
    await this.page.waitForSelector(this.submitButton, { state: "visible" });
  }
}
