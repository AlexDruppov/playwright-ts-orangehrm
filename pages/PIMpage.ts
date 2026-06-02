import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PIMPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    get headingAttachments() { return this.page.getByRole('heading', { name: 'Attachments' }) }
    get noRecordsFoundMessage() { return this.page.locator("span.oxd-text--span").filter({ hasText: 'No Records Found' }) }
    get fileInput() { return this.page.locator('input.oxd-file-input') }
    get dateApplicationInput() { return this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }) }
    get createLoginToggle() { return this.page.locator('.user-form-header', { hasText: 'Create Login Details' }).locator('.oxd-switch-input') }
    get createLoginCheckbox() { return this.page.locator('.user-form-header', { hasText: 'Create Login Details' }).locator('input[type="checkbox"]') }

    async checkCandidateProfile(label: string, value: string) {
        const container = this.getFieldContainer(label)
        const input = container.locator('input');
        await expect(input).toHaveValue(value, { timeout: 7000 })
    }

    async checkHeadingAttachments() {
        await expect(this.headingAttachments).toBeVisible()
    }


    //Recruitment_Candidates_Application Stage
    async checkApplicationStage(label: string, value: string) {
        const date = this.page.locator(`//div[label[text()='${label}']]//following-sibling::div//p`)
        await expect(date).toHaveText(value)
    }
    //Recruitment_Candidates_Candidate Profile
    async checkCandidateProfileInput(locator: Locator, value: string) {
        await expect(locator).toHaveValue(value)
    }

    async clickProfileLink(link: string) {
        await this.page.getByRole('link', { name: link }).click()
    }

    async clickCreateLoginToggle() {
        const isOn = await this.createLoginCheckbox.isChecked();
        if (!isOn) {
            await this.createLoginToggle.click()
        }
    }

    async checkFullName(fullName: string) {
        await expect(this.page.getByRole('heading', { name: fullName })).toBeVisible()
    }

    async checkUserProfileName(fullName: string) {
        await expect(this.page.getByText(fullName)).toBeVisible();
    }


    async selectLoginStatus(status: string) {
        await this.page.getByText(status).click()
    }
}



