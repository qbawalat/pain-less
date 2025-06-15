import { BasePage } from "./BasePage";

interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  timeOfDay?: string;
}

interface Alert {
  type: string;
  severity: string;
  message: string;
  date?: string;
  acknowledged?: boolean;
}

interface ProfileData {
  height: number;
  weight: number;
}

export class MainDashboardPage extends BasePage {
  // Selectors
  private readonly mainDashboard = '[data-testid="main-dashboard"]';
  private readonly createProfileContainer = '[data-testid="create-profile-container"]';
  private readonly globalErrorContainer = '[data-testid="global-error-container"]';
  private readonly supplementsList = '[data-testid="supplement-list"]';
  private readonly alertsList = '[data-testid="alert-system"]';
  private readonly calendar = '[data-testid="calendar-widget"]';
  private readonly profileSection = '[data-testid="health-stats"]';
  private readonly analysisSection = '[data-testid="ai-health-analysis"]';

  // Health Profile Creation Modal Selectors
  private readonly healthProfileModal = '[data-testid="create-profile-container"]';
  private readonly birthDateInput = '[data-testid="birth-date-input"]';
  private readonly heightInput = '[data-testid="height-input"]';
  private readonly weightInput = '[data-testid="weight-input"]';
  private readonly newMedicalConditionInput = '[data-testid="new-medical-condition-input"]';
  private readonly addMedicalConditionButton = '[data-testid="add-medical-condition-button"]';
  private readonly newFamilyConditionInput = '[data-testid="new-family-condition-input"]';
  private readonly addFamilyConditionButton = '[data-testid="add-family-condition-button"]';
  private readonly saveProfileButton = '[data-testid="save-profile-button"]';

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

  // Health Profile Creation Methods
  async fillBasicHealthInfo(birthDate: string, height: number, weight: number) {
    await this.fill(this.birthDateInput, birthDate);
    await this.fill(this.heightInput, height.toString());
    await this.fill(this.weightInput, weight.toString());
  }

  async addMedicalCondition(condition: string) {
    await this.fill(this.newMedicalConditionInput, condition);
    await this.click(this.addMedicalConditionButton);
  }

  async addFamilyCondition(condition: string) {
    await this.fill(this.newFamilyConditionInput, condition);
    await this.click(this.addFamilyConditionButton);
  }

  async getSelectedMedicalConditions(): Promise<string[]> {
    const conditions = await this.page.$$(
      '[data-testid="selected-medical-conditions"] [data-testid^="medical-condition-"]'
    );
    return Promise.all(
      conditions.map((condition) => condition.$eval('[data-testid="condition-name"]', (el) => el.textContent || ""))
    );
  }

  async getSelectedFamilyConditions(): Promise<string[]> {
    const conditions = await this.page.$$(
      '[data-testid="selected-family-conditions"] [data-testid^="family-condition-"]'
    );
    return Promise.all(
      conditions.map((condition) => condition.$eval('[data-testid="condition-name"]', (el) => el.textContent || ""))
    );
  }

  async submitHealthProfile() {
    await this.click(this.saveProfileButton);
    // Wait for the modal to disappear and dashboard to appear
    await this.waitForDashboard();
  }

  // Supplement management
  async addSupplement(supplement: Supplement) {
    // Wait for supplement list to be visible
    await this.waitForSelector(this.supplementsList);

    // Click add button in SupplementList component
    await this.click('[data-testid="add-supplement-button"]');
    await this.fill('[data-testid="supplement-name-input"]', supplement.name);
    await this.fill('[data-testid="supplement-dosage-input"]', supplement.dosage);
    await this.fill('[data-testid="supplement-frequency-input"]', supplement.frequency);
    await this.fill('[data-testid="supplement-start-date-input"]', supplement.startDate);
    if (supplement.timeOfDay) {
      await this.page.selectOption('[data-testid="supplement-time-of-day-select"]', supplement.timeOfDay);
    }
    await this.click('[data-testid="save-supplement-button"]');
  }

  async getSupplements(): Promise<Supplement[]> {
    const supplements = await this.page.$$(this.supplementsList + ' [data-testid="supplement-item"]');
    return Promise.all(
      supplements.map(async (supplement) => {
        const name = await supplement.$eval('[data-testid="supplement-name"]', (el) => el.textContent || "");
        const dosage = await supplement.$eval('[data-testid="supplement-dosage"]', (el) => el.textContent || "");
        const frequency = await supplement.$eval('[data-testid="supplement-frequency"]', (el) => el.textContent || "");
        const startDate = await supplement.$eval('[data-testid="supplement-start-date"]', (el) => el.textContent || "");
        return { name, dosage, frequency, startDate };
      })
    );
  }

  async editSupplement(name: string, updates: Partial<Supplement>) {
    const supplementItem = await this.page.$(`[data-testid="supplement-item"][data-name="${name}"]`);
    if (!supplementItem) throw new Error(`Supplement ${name} not found`);

    await this.page.click(
      `[data-testid="supplement-item"][data-name="${name}"] [data-testid="edit-supplement-button"]`
    );
    if (updates.dosage) await this.fill('[data-testid="supplement-dosage-input"]', updates.dosage);
    if (updates.frequency) await this.fill('[data-testid="supplement-frequency-input"]', updates.frequency);
    await this.click('[data-testid="save-supplement-button"]');
  }

  async deleteSupplement(name: string) {
    const supplementItem = await this.page.$(`[data-testid="supplement-item"][data-name="${name}"]`);
    if (!supplementItem) throw new Error(`Supplement ${name} not found`);

    await this.page.click(
      `[data-testid="supplement-item"][data-name="${name}"] [data-testid="delete-supplement-button"]`
    );
    await this.click('[data-testid="confirm-delete-button"]');
  }

  // Alert management
  async triggerHealthAlert(alert: Alert) {
    await this.click('[data-testid="generate-alert-button"]');
    await this.page.selectOption('[data-testid="alert-type-select"]', alert.type);
    await this.page.selectOption('[data-testid="alert-severity-select"]', alert.severity);
    await this.fill('[data-testid="alert-message-input"]', alert.message);
    if (alert.date) {
      await this.fill('[data-testid="alert-date-input"]', alert.date);
    }
    await this.click('[data-testid="confirm-generate-button"]');
  }

  async getAlerts(): Promise<Alert[]> {
    const alerts = await this.page.$$(this.alertsList + ' [data-testid="alert-item"]');
    return Promise.all(
      alerts.map(async (alert) => ({
        type: await alert.$eval('[data-testid="alert-type"]', (el) => el.textContent || ""),
        severity: await alert.$eval('[data-testid="alert-severity"]', (el) => el.textContent || ""),
        message: await alert.$eval('[data-testid="alert-message"]', (el) => el.textContent || ""),
        acknowledged: await alert.$eval('[data-testid="alert-status"]', (el) => el.textContent === "acknowledged"),
      }))
    );
  }

  async acknowledgeAlert(type: string) {
    const alertItem = await this.page.$(`[data-testid="alert-item"][data-type="${type}"]`);
    if (!alertItem) throw new Error(`Alert of type ${type} not found`);

    await this.page.click(`[data-testid="alert-item"][data-type="${type}"] [data-testid="acknowledge-alert-button"]`);
    await this.click('[data-testid="confirm-acknowledge-button"]');
  }

  // Calendar management
  async getCalendarEvents() {
    const events = await this.page.$$(this.calendar + ' [data-testid="calendar-event"]');
    return Promise.all(
      events.map(async (event) => ({
        type: await event.$eval('[data-testid="event-type"]', (el) => el.textContent || ""),
        name: await event.$eval('[data-testid="event-name"]', (el) => el.textContent || ""),
        message: await event.$eval('[data-testid="event-message"]', (el) => el.textContent || ""),
      }))
    );
  }

  // Profile management
  async navigateToProfile() {
    await this.click('[data-testid="profile-link"]');
    await this.waitForSelector(this.profileSection);
  }

  async getProfileData(): Promise<ProfileData> {
    return {
      height: parseInt((await this.getText('[data-testid="height-input"]')) || "0"),
      weight: parseInt((await this.getText('[data-testid="weight-input"]')) || "0"),
    };
  }

  async getMedicalConditions(): Promise<string[]> {
    const conditions = await this.page.$$(
      '[data-testid="selected-medical-conditions"] [data-testid^="medical-condition-"]'
    );
    return Promise.all(
      conditions.map((condition) => condition.$eval('[data-testid="condition-name"]', (el) => el.textContent || ""))
    );
  }

  // AI Analysis
  async requestHealthAnalysis() {
    await this.click('[data-testid="request-analysis-button"]');
  }

  async isAnalysisInProgress(): Promise<boolean> {
    return await this.isVisible('[data-testid="analysis-progress"]');
  }

  async waitForAnalysisCompletion() {
    await this.waitForSelector('[data-testid="analysis-results"]');
  }

  async getAnalysisResults() {
    return {
      recommendations: await this.getText('[data-testid="analysis-recommendations"]'),
      insights: await this.getText('[data-testid="analysis-insights"]'),
    };
  }

  async getAIRecommendations() {
    return await this.getText('[data-testid="ai-recommendations"]');
  }
}
