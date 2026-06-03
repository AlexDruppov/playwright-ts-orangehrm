import { faker } from "@faker-js/faker"
import { test } from "../../fixtures/fixture";
import { PageName } from "../../pages/emum/PageName";
import { TabName } from "../../pages/emum/TabName";
import { generateData } from "../../pages/components/ramdom-data";

/* const jobData = () => ({
  vacancyName: faker.person.jobTitle(),
  description: faker.company.catchPhraseDescriptor(),
}); */
test.describe('Create Vacancies Flow', () => {
  const vacancyStatus = [true, false]
  for (const status of vacancyStatus) {
    const statusLabel = status ? 'Active' : 'Closed';
    test(`create ${statusLabel} Vacancy`, async ({ dashboardPage, recruitmentPage }) => {
      const data = generateData();
      await dashboardPage.expectDashboardVisible();
      await recruitmentPage.switchPage(PageName.Recruitment)
      await recruitmentPage.switchTab(TabName.Vacancies)
      await recruitmentPage.clickBtn('Add')
      await recruitmentPage.fillInput('Vacancy Name', data.vacancyName)
      const jobTitle = await recruitmentPage.selectRandomElement('Job Title')
      await recruitmentPage.fillInput('Description', data.description)
      const manager = await recruitmentPage.fillAutocompleteField('Hiring Manager', 'John Doe')
      const toggle = await recruitmentPage.setVacancyStatus(status)
      await recruitmentPage.clickBtn('Save')
      await recruitmentPage.switchTab(TabName.Vacancies)
      await recruitmentPage.selectElement('Job Title', jobTitle)
      let vacancyName;
      if (toggle === 'Closed') {
        vacancyName = data.vacancyName + ' (Closed)'
        await recruitmentPage.selectElement('Vacancy', vacancyName)
      } else {
        await recruitmentPage.selectElement('Vacancy', data.vacancyName)
      }
      await recruitmentPage.selectElement('Hiring Manager', manager)
      await recruitmentPage.clickBtn('Search')
      await recruitmentPage.checkTableCellValue(data.vacancyName,
        jobTitle,
        manager,
      )
    })
  }
})

test('delete vacancy', async ({ dashboardPage, recruitmentPage, }) => {
  const data = generateData();
  await dashboardPage.expectDashboardVisible();
  await recruitmentPage.switchPage(PageName.Recruitment)
  await recruitmentPage.switchTab(TabName.Vacancies)
  await recruitmentPage.clickBtn('Add')
  await recruitmentPage.fillInput('Vacancy Name', data.vacancyName)
  const jobTitle = await recruitmentPage.selectRandomElement('Job Title')
  await recruitmentPage.fillInput('Description', data.description)
  const manager = await recruitmentPage.fillAutocompleteField('Hiring Manager', 'John Doe')
  await recruitmentPage.clickBtn('Save')
  await recruitmentPage.switchTab(TabName.Vacancies)
  await recruitmentPage.selectElement('Job Title', jobTitle)
  await recruitmentPage.selectElement('Vacancy', data.vacancyName)
  await recruitmentPage.selectElement('Hiring Manager', manager)
  await recruitmentPage.clickBtn('Search')
  await recruitmentPage.checkTableCellValue(data.vacancyName,
    jobTitle,
    manager,
  )
  await recruitmentPage.clickDeleteBtn()
  await recruitmentPage.checkNoRecordsFoundMessage()
})