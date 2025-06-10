import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  protected async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }

  protected async click(selector: string) {
    await this.page.click(selector);
  }

  protected async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  protected async getText(selector: string) {
    return await this.page.textContent(selector);
  }

  protected async isVisible(selector: string) {
    return await this.page.isVisible(selector);
  }
}
