import { BasePage } from "./BasePage";

export class CreateHealthProfilePage extends BasePage {
  // Selectors
  private readonly form = '[data-testid="health-profile-form"]';
  private readonly birthDateInput = '[data-testid="birth-date-input"]';
  private readonly heightInput = '[data-testid="height-input"]';
  private readonly weightInput = '[data-testid="weight-input"]';
  private readonly customMedicalConditionInput = '[data-testid="custom-medical-condition-input"]';
  private readonly addMedicalConditionButton = '[data-testid="add-medical-condition-button"]';
  private readonly familyConditionInput = '[data-testid="family-condition-input"]';
  private readonly addFamilyConditionButton = '[data-testid="add-family-condition-button"]';
  private readonly submitButton = '[data-testid="create-profile-submit-button"]';
  private readonly selectedMedicalConditions = '[data-testid="selected-medical-conditions"]';
  private readonly selectedFamilyConditions = '[data-testid="selected-family-conditions"]';

  // constructor(page: Page) {
  //   super(page);
  // }

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
    const selector = `[data-testid="suggested-condition-${conditionName.toLowerCase().replace(/\s+/g, "-")}"]`;
    await this.click(selector);
  }

  async removeMedicalCondition(index: number) {
    const selector = `[data-testid="remove-medical-condition-${index}"]`;
    await this.click(selector);
  }

  async removeFamilyCondition(index: number) {
    const selector = `[data-testid="remove-family-condition-${index}"]`;
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
