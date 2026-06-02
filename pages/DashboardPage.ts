import { expect, Locator, Page } from "@playwright/test";

export class DashboardPage {
    readonly page:Page;
    readonly dashboardPageHeading:Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardPageHeading = page.getByRole('heading',{name: 'Dashboard'});
    }

    async expectDashboardVisible(){
        await expect(this.dashboardPageHeading).toBeVisible(); 
    }
}