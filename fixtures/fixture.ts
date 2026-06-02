import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { PIMPage } from '../pages/PIMpage';
import { RecruitmentPage } from '../pages/RecruitmentPage';


export const test = base.extend<{
    dashboardPage: DashboardPage;
    pimPage: PIMPage;
    loginPage: LoginPage;
    recruitmentPage: RecruitmentPage;
}>({
    dashboardPage: async ({ loginPage }, use) => {
        await loginPage.navigate();
        const username = process.env.USER || 'Admin';
        const password = process.env.PASSWORD || 'Admin@_123';
        const dashboardPage = await loginPage.login(username, password)
        //const dashboardPage = await loginPage.login('Admin', 'Admin@_123')
        await use(dashboardPage)
    },
    pimPage: async ({ page }, use) => {
        await use(new PIMPage(page))
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },
    recruitmentPage: async ({ page }, use) => {
        await use(new RecruitmentPage(page))
    },
})