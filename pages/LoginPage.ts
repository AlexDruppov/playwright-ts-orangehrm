import { expect, Page } from "@playwright/test";
import { DashboardPage } from "./DashboardPage";
import { BasePage } from "./BasePage";


export class LoginPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    get usernameInput() { return this.page.locator("[name='username']") }
    get passwordInput() { return this.page.locator("[name='password']") }
    get loginBtn() { return this.page.getByRole('button', { name: 'Login' }) }

    async navigate() {
        await this.page.goto('/');
    }

    async login(username: string, password: string): Promise<DashboardPage> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
        return new DashboardPage(this.page);
    }

    async errorMessage(message:string){
        const locator = this.page.getByText(message);
        await expect(locator).toBeVisible()
    };
    

}