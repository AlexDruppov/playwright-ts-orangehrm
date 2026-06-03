import { test } from '../../fixtures/fixture'
import { faker } from '@faker-js/faker';
import { PageName } from '../../pages/emum/PageName';
import { TabName } from '../../pages/emum/TabName';
import { generateData } from '../../pages/components/ramdom-data';

test.describe('Employees Management', () => {
    test('should add an employee without credentials', async ({ dashboardPage, pimPage }) => {
        const data = generateData()
        await dashboardPage.expectDashboardVisible();
        await pimPage.switchPage(PageName.PIM)
        await pimPage.switchTab(TabName.AddEmployee)
        await pimPage.fillFirstName(data.firstName)
        await pimPage.fillLastName(data.lastName)
        await pimPage.fillInput('Employee Id', data.id)
        await pimPage.clickBtn('Save')
        await pimPage.clickProfileLink('Job')
        await pimPage.selectDate('Joined Date', { month: 'January', year: '1990', day: '15' })
        const subUnit = await pimPage.selectRandomElement('Sub Unit')
        const jobTitle = await pimPage.selectRandomElement('Job Title')
        const status = await pimPage.selectRandomElement('Employment Status')
        await pimPage.clickBtn('Save')
        await pimPage.switchTab(TabName.EmployeeList)
        await pimPage.fillInput('Employee Id', data.id)
        await pimPage.clickBtn('Search')
        console.log(data.firstName)
        console.log(data.lastName)
        console.log(subUnit)
        console.log(jobTitle)
        console.log(status)
        await pimPage.checkTableCellValue(
            data.id,
            data.lastName,
            subUnit,
            jobTitle,
            status
        )
    })
    test.describe('add employee with credentials', () => {
        const statusList = ['Enabled', 'Disabled'];
        for (const status of statusList) {
            test(`Create ${status} Login Details`, async ({ dashboardPage, pimPage, loginPage }) => {
                const data = generateData()
                const fullName = `${data.firstName} ${data.lastName}`
                await dashboardPage.expectDashboardVisible();
                await pimPage.switchPage(PageName.PIM)
                await pimPage.switchTab(TabName.AddEmployee)
                await pimPage.fillFirstName(data.firstName)
                await pimPage.fillLastName(data.lastName)
                await pimPage.fillInput('Employee Id', data.id)
                await pimPage.clickCreateLoginToggle()
                await pimPage.selectLoginStatus(status)
                await pimPage.fillInput('Username', data.username)
                await pimPage.fillInput('Password', data.password)
                await pimPage.fillInput('Confirm Password', data.password)
                await pimPage.clickBtn('Save')
                await pimPage.checkFullName(fullName)
                await pimPage.logout()
                if (status === 'Disabled') {
                    await loginPage.login(data.username, data.password);
                    await loginPage.errorMessage('Account disabled');
                } else {
                    await loginPage.login(data.username, data.password);
                    await pimPage.checkUserProfileName(fullName);
                }
            })
        }
    })
})