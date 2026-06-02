import { test } from '../../fixtures/fixture';
import { faker } from '@faker-js/faker';
import { PageName } from '../../pages/emum/PageName';
import { TabName } from '../../pages/emum/TabName';

const employeeData = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    id: faker.string.numeric(5),
    username: faker.internet.username(),
    password: faker.internet.password({ pattern: /[A-Z0-9a-z\W]/ }) + 1
});
test.describe('Employee Validation', () => {
    test.beforeEach(async ({ dashboardPage, pimPage }) => {
        await dashboardPage.expectDashboardVisible();
        await pimPage.switchPage(PageName.PIM);
        await pimPage.switchTab(TabName.AddEmployee);
    })

    test.describe('Mandatory Name Field', () => {
        test('should require First Name', async ({ pimPage }) => {
            const data = employeeData();
            await pimPage.fillLastName(data.lastName);
            await pimPage.fillInput('Employee Id', data.id);
            await pimPage.clickBtn('Save')
            await pimPage.checkFirstNameInputValidation()
        })
        test('should require Last Name', async ({ pimPage }) => {
            const data = employeeData();
            await pimPage.fillFirstName(data.firstName);
            await pimPage.fillInput('Employee Id', data.id);
            await pimPage.clickBtn('Save')
            await pimPage.checkLastNameInputValidation()
        })
        test('should require Username', async ({ pimPage }) => {
            const data = employeeData();
            await pimPage.fillFirstName(data.lastName);
            await pimPage.fillLastName(data.firstName);
            await pimPage.clickCreateLoginToggle()
            await pimPage.fillInput('Password', data.password)
            await pimPage.fillInput('Confirm Password', data.password)
            await pimPage.clickBtn('Save')
            await pimPage.checkInputValidation('Username', 'Required')
        })
    })
    test.describe('Password matching and presence', () => {
        const requiredMessage = [
            { field: 'Password', emptyField: 'Confirm Password', message: 'Passwords do not match' },
            { field: 'Confirm Password', emptyField: 'Password', message: 'Required' }
        ];
        for (const { field, emptyField, message } of requiredMessage) {
            test(`Required ${field} Field Validation`, async ({ pimPage }) => {
                const data = employeeData();
                await pimPage.fillFirstName(data.lastName);
                await pimPage.fillLastName(data.firstName);
                await pimPage.clickCreateLoginToggle();
                await pimPage.fillInput(field, data.password);
                await pimPage.clickBtn('Save');
                await pimPage.checkInputValidation(emptyField, message);
            })
        }
    })
    test.describe('Password complexity', () => {
        const passwordCases = [
            {
                password: 'qwert1',
                message: 'Should have at least 8 characters'
            },
            {
                password: 'qwertyui',
                message: 'Your password must contain minimum 1 upper-case letter'
            },
            {
                password: 'Qwerty12',
                message: 'Your password must contain minimum 1 special character'
            }
        ];
        for (const { password, message } of passwordCases) {
            test(`Password validation:'${password}'`, async ({ pimPage }) => {
                const data = employeeData();
                await pimPage.fillFirstName(data.lastName);
                await pimPage.fillLastName(data.firstName);
                await pimPage.clickCreateLoginToggle()
                await pimPage.fillInput('Password', password)
                await pimPage.checkInputValidation('Password', message)
            })
        }
    })
})
