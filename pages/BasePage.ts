import { expect, Page } from "@playwright/test";
import { PageName } from "./emum/PageName";
import { TabName } from "./emum/TabName";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get toastMessage() { return this.page.locator('.oxd-toast'); }
    get loader() { return this.page.locator('.oxd-loading-spinner'); }
    get editbtn() { return this.page.locator("//button//i[contains(@class, 'bi-pencil-fill')]") }
    get deletebtn() { return this.page.locator("//button//i[contains(@class, 'bi-trash')]") }
    get deleteConfirmBtn() { return this.page.getByRole('button', { name: 'Yes, Delete' }) }
    get firstNameInput() { return this.page.locator('input[name="firstName"]') }
    get lastNameInput() { return this.page.locator('input[name="lastName"]') }


    get monthSelectorButton() { return this.page.locator('.oxd-calendar-selector-month .oxd-text') }
    get yearSelectorButton() { return this.page.locator('.oxd-calendar-selector-year .oxd-text') }
    get dateApplicationInput() { return this.page.getByRole('textbox', { name: 'yyyy-mm-dd' }) }
    get noRecordsFoundMessage() { return this.page.locator("span.oxd-text--span").filter({ hasText: 'No Records Found' }) }


    // --- Navigation
    async switchPage(pageName: PageName) {
        const menuLink = this.page.getByRole('link', { name: pageName });
        await menuLink.click();
        await expect(this.page.locator('.oxd-topbar-header-title')).toContainText(pageName);
    }

    async switchTab(tab: TabName) {
        const tabLink = this.page.getByRole('link', { name: tab })
        await tabLink.waitFor({ state: "visible", timeout: 2000 })
        await tabLink.click();
    }
    async logout() {
        const userDropdown = this.page.locator('.oxd-userdropdown-tab');
        await userDropdown.click();
        const logoutBtn = this.page.getByRole('menuitem', { name: 'Logout' });
        await logoutBtn.waitFor({ state: 'visible', timeout: 5000 })
        await logoutBtn.click()
        await expect(this.page).toHaveURL(/\/auth\/login/);
    }

    // --- General actions ---
    // - Button - 
    async clickBtn(btn: string) {
        //btn: 'Save' | 'Search' | 'Add' | 'Cancel' | 'Yes, Delete'
        const button = this.page.getByRole('button', { name: `${btn}` });
        await button.click();
        await this.waitForLoader()
        if (btn === 'Save') {
            await this.verifySuccessNotification();
            await this.waitForLoader()
           //await expect(toast).toBeHidden();
        }
        return this;
    }
    async clickEditeBtn() {
        await this.editbtn.click()
    }
    async clickDeleteBtn() {
        await this.deletebtn.click()
        await this.deleteConfirmBtn.click()
        await this.verifySuccessNotification()
    }
    // - Input and Select
    protected getFieldContainer(label: string) {
        return this.page.locator('.oxd-input-group').filter({
            has: this.page.locator('label').getByText(label, { exact: true })
        });
    }
    async fillInput(label: string, value: string) {
        const container = this.getFieldContainer(label);
        const input = container.locator('input, textarea');
        await expect(input).toBeVisible();
        await input.fill(value);
        return this;
    }
    async fillFirstName(value: string) {
        await this.firstNameInput.fill(value)
    }
    async fillLastName(value: string) {
        await this.lastNameInput.fill(value)
    }

    async selectElement(label: string, value: string): Promise<string | null> {
        const container = this.getFieldContainer(label);
        const select = container.locator('.oxd-select-wrapper');
        await select.click();
        const option = this.page.getByRole('option', { name: value, exact: true });
        await option.click();
        return await select.textContent();
    }

    async selectRandomElement(label: string): Promise<string> {
        const container = this.getFieldContainer(label);
        await container.locator('.oxd-select-wrapper').click();
        const listbox = this.page.getByRole('listbox');
        const options = listbox.getByRole('option').filter({ hasNotText: '-- Select --' });
        const count = await options.count();
        if (count === 0) throw new Error(`Options not found for ${label}`);
        const randomIndex = Math.floor(Math.random() * count);
        const option = options.nth(randomIndex);
        const value = (await option.textContent())?.trim() || '';
        await option.click();
        return value;
    }
    async fillAutocompleteField(label: string, value: string): Promise<string> {
        const container = this.getFieldContainer(label)
        const input = container.locator('input');
        await input.fill(value)
        const option = this.page.getByRole('option').filter({ hasText: value }).first();
        //await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
        return input.inputValue();
    }

    // --- Expectations and Verifications ---
    protected async waitForLoader() {
        const loader = this.page.locator('.oxd-loading-spinner');
        await loader.first().waitFor({ state: 'visible', timeout: 1000 }).catch(() => { });

        // Ждём исчезновения
        await loader.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => { });
    }

    async verifySuccessNotification() {
        const toast = this.toastMessage;
        await Promise.race([
            toast.waitFor({ state: 'visible' }),
            toast.waitFor({ state: 'hidden' })
        ])
        if (await toast.isVisible()) {
            await expect(toast).toContainText('Success');
            await toast.waitFor({ state: 'hidden', timeout: 2000 })
        }
    }

    //Calendar
    async selectDate(label: string, date: { month: string, year: string, day: string }): Promise<string> {
        const { month, year, day } = date;
        await this.getFieldContainer(label).locator('input').click();
        await expect(this.monthSelectorButton).toBeVisible();
        await this.monthSelectorButton.click()

        const monthOption = this.page.locator(`//li[.='${month}']`)
        await expect(monthOption).toBeVisible()
        await monthOption.click()

        await this.yearSelectorButton.click()
        const yearOption = this.page.locator(`//li[.='${year}']`)
        await expect(yearOption).toBeVisible()
        await yearOption.click()

        const dayElement = this.page.getByText(day, { exact: true })
        await expect(dayElement).toBeVisible()
        await dayElement.click();

        await this.expectApplicationDate(date.month, date.year, date.day)
        return await this.getFieldContainer(label).locator('input').inputValue()

    }

    private async expectApplicationDate(month: string, year: string, day: string) {
        const monthMap: Record<string, string> = {
            January: '01', February: '02', March: '03', April: '04',
            May: '05', June: '06', July: '07', August: '08',
            September: '09', October: '10', November: '11', December: '12',
        };
        const numMonth = monthMap[month];
        const formattedDay = day.padStart(2, '0');
        const expected = `${year}-${numMonth}-${formattedDay}`
        await expect(this.dateApplicationInput).toHaveValue(expected)
    }

    //
    async checkTableCellValue(element: string, ...values: string[]) {
        const row = this.page.locator('.oxd-table-card').filter({ hasText: element });
        await expect(row).toBeVisible({ timeout: 1000 });

        for (const value of values) {
            const cellValue = row.getByText(value, { exact: true });
            await expect(cellValue).toBeVisible();
        }
    }

    async checkNoRecordsFoundMessage() {
        await expect(this.noRecordsFoundMessage).toBeVisible()
    }
    async checkFirstNameInputValidation() {
        await expect(this.firstNameInput).toHaveClass(/oxd-input--error/);
        const errorMessage = 'xpath=./parent::div/following-sibling::span'
        const messageLocator = this.firstNameInput.locator(errorMessage);
        await expect(messageLocator).toHaveText('Required')
    }
    async checkLastNameInputValidation() {
        await expect(this.lastNameInput).toHaveClass(/oxd-input--error/)
        const errorMessage = 'xpath=./parent::div/following-sibling::span'
        const messageLocator = this.lastNameInput.locator(errorMessage);
        await expect(messageLocator).toHaveText('Required')
    }
    async checkInputValidation(label: string, message: string) {
        const container = this.getFieldContainer(label);
        const messageLocator = container.locator('span');
        await expect(messageLocator).toHaveText(message);
    }
}