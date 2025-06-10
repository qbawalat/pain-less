import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CreateHealthProfilePage extends BasePage {
  // Selectors
  private readonly form = '[data-test-id="health-profile-form"]';
  private readonly birthDateInput = '[data-test-id="birth-date-input"]';
  private readonly heightInput = '[data-test-id="height-input"]';
  private readonly weightInput = '[data-test-id="weight-input"]';
  private readonly customMedicalConditionInput = '[data-test-id="custom-medical-condition-input"]';
  private readonly addMedicalConditionButton = '[data-test-id="add-medical-condition-button"]';
  private readonly familyConditionInput = '[data-test-id="family-condition-input"]';
  private readonly addFamilyConditionButton = '[data-test-id="add-family-condition-button"]';
  private readonly submitButton = '[data-test-id="create-profile-submit-button"]';
  private readonly selectedMedicalConditions = '[data-test-id="selected-medical-conditions"]';
  private readonly selectedFamilyConditions = '[data-test-id="selected-family-conditions"]';

  constructor(page: Page) {
    super(page);
  }

  async waitForForm() {
    await this.waitForSelector(this.form);
  }

  async fillBasicInfo(birthDate: string, height: number, weight: number) {
    await this.fill(this.birthDateInput, birthDate);
    await this.fill(this.heightInput, height.toString());
    await this.fill(this.weightInput, weight.toString());
  }

  async addMedicalCondition(condition: string) {
    await this.fill(this.customMedicalConditionInput, condition);
    await this.click(this.addMedicalConditionButton);
  }

  async addFamilyCondition(condition: string) {
    await this.fill(this.familyConditionInput, condition);
    await this.click(this.addFamilyConditionButton);
  }

  async addSuggestedCondition(conditionName: string) {
    const selector = `[data-test-id="suggested-condition-${conditionName.toLowerCase().replace(/\s+/g, "-")}"]`;
    await this.click(selector);
  }

  async removeMedicalCondition(index: number) {
    const selector = `[data-test-id="remove-medical-condition-${index}"]`;
    await this.click(selector);
  }

  async removeFamilyCondition(index: number) {
    const selector = `[data-test-id="remove-family-condition-${index}"]`;
    await this.click(selector);
  }

  async submit() {
    await this.click(this.submitButton);
  }

  async isFormVisible() {
    return await this.isVisible(this.form);
  }

  async getSelectedMedicalConditions() {
    const container = await this.page.$(this.selectedMedicalConditions);
    if (!container) return [];
    return await container.$$eval("span", (spans) => spans.map((span) => span.textContent));
  }

  async getSelectedFamilyConditions() {
    const container = await this.page.$(this.selectedFamilyConditions);
    if (!container) return [];
    return await container.$$eval("span", (spans) => spans.map((span) => span.textContent));
  }
}
