import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MainDashboardPage extends BasePage {
  // Selectors
  private readonly mainDashboard = '[data-test-id="main-dashboard"]';
  private readonly createProfileContainer = '[data-test-id="create-profile-container"]';
  private readonly globalErrorContainer = '[data-test-id="global-error-container"]';

  constructor(page: Page) {
    super(page);
  }

  async waitForDashboard() {
    await this.waitForSelector(this.mainDashboard);
  }

  async waitForCreateProfile() {
    await this.waitForSelector(this.createProfileContainer);
  }

  async isDashboardVisible() {
    return await this.isVisible(this.mainDashboard);
  }

  async isCreateProfileVisible() {
    return await this.isVisible(this.createProfileContainer);
  }

  async isGlobalErrorVisible() {
    return await this.isVisible(this.globalErrorContainer);
  }

  async getGlobalErrorText() {
    return await this.getText(this.globalErrorContainer);
  }
}
