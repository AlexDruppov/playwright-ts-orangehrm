import { expect, Page } from "@playwright/test";
import { PageName } from "../emue/PageName";
import { TabName } from "../emue/TabName";

export class Navigation {
    constructor(private page: Page){}

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
}

