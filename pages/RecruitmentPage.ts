import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { faker } from "@faker-js/faker";

export class RecruitmentPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    get candidateStatus() { return this.page.locator('p.oxd-text--subtitle-2') }

    async getCandidateStatus() {
        await this.candidateStatus.waitFor({ state: 'visible', timeout: 10000 });
        const statusText = await this.candidateStatus.innerText()
        const status = statusText.replace('Status:', '').trim()
        return status
    }
    async setVacancyStatus(status: boolean): Promise<string> {
        const activeToggle = this.page.locator('.oxd-grid-item', { hasText: 'Active' }).locator('.oxd-switch-input');
        const isOn = await activeToggle.isChecked();
        if (isOn === status) {
            return status ? 'Active' : 'Closed';
        }
        await activeToggle.click()
        if (status) {
            await expect(activeToggle).toBeChecked();
            return 'Active'
        } else {
            await expect(activeToggle).not.toBeChecked();
            return 'Closed';
        }
    }
    async moveThroughWorkflow(action: string) {
        await this.clickBtn(action)
        await this.clickBtn('Save');
    }
    async scheduleInterview(
        name: string,
        interviewer: string,
        data: { month: string, year: string, day: string }
    ) {
        await this.clickBtn('Schedule Interview');
        await this.fillInput('Interview Title', name)
        await this.fillAutocompleteField('Interviewer', interviewer)
        await this.selectDate('Date', data)
        await this.clickBtn('Save');
    }
    async getFutureDate() {
        const futureDate = faker.date.soon({days: 10});

        const month = futureDate.toLocaleString('en-US', { month: 'long' });
        const year = futureDate.getFullYear().toString();
        const day = futureDate.getDate().toString(); // Без padStart, чтобы клик сработал!

        return { month, year, day };
    };
}