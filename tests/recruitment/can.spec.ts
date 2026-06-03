import { da, faker } from "@faker-js/faker"
import { test } from "../../fixtures/fixture";
import { RecruitmentPage } from "../../pages/RecruitmentPage";
import { PageName } from "../../pages/emum/PageName";
import { TabName } from "../../pages/emum/TabName";
import { generateData} from "../../pages/components/ramdom-data"

async function createCandidate(recruitmentPage: RecruitmentPage) {
    const data = generateData();
    await recruitmentPage.fillFirstName(data.firstName);
    await recruitmentPage.fillLastName(data.lastName);
    await recruitmentPage.fillInput('Email', data.email);
    await recruitmentPage.fillInput('Contact Number', data.phone);
    const vacancy = await recruitmentPage.selectRandomElement('Vacancy');
    const dateValue = await recruitmentPage.selectDate('Date of Application', { month: 'January', year: '1990', day: '15' });
    await recruitmentPage.fillInput('Keywords', data.keyword);
    await recruitmentPage.fillInput('Notes', data.keyword);
    await recruitmentPage.clickBtn('Save');

    return {
     firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        vacancy,      
        dateValue,    
        keyword: data.keyword,
        note: data.note
    }
}
test.describe('Candidate flow', () => {
    const statuses = ['Reject', 'Shortlist',]
    for (const status of statuses) {
        test(`create and ${status} candidat`, async ({ dashboardPage, recruitmentPage, }) => {
            await dashboardPage.expectDashboardVisible();
            await recruitmentPage.switchPage(PageName.Recruitment);
            await recruitmentPage.clickBtn('Add');
            const data = await createCandidate(recruitmentPage);
            await recruitmentPage.clickBtn(status);
            await recruitmentPage.clickBtn('Save');
            const candidatStatus = await recruitmentPage.getCandidateStatus();
            await recruitmentPage.switchTab(TabName.Candidates);
            await recruitmentPage.fillAutocompleteField('Candidate Name', data.lastName)
            await recruitmentPage.fillInput('Keywords', data.keyword);
            await recruitmentPage.clickBtn('Search')
            await recruitmentPage.checkTableCellValue(
                data.fullName,
                data.vacancy,
                data.dateValue,
                candidatStatus
            )
        })
    }
    test('from Shortlist to Hire', async ({ dashboardPage, recruitmentPage }) => {
        const statuses = ['Mark Interview Passed', 'Offer Job', 'Hire']
        const intrviewTittle = faker.person.jobType();
        await dashboardPage.expectDashboardVisible();
        await recruitmentPage.switchPage(PageName.Recruitment);
        await recruitmentPage.clickBtn('Add');
        const data = await createCandidate(recruitmentPage);
        await recruitmentPage.clickBtn('Shortlist');
        await recruitmentPage.clickBtn('Save');
        const appDate = await recruitmentPage.getFutureDate();
        await recruitmentPage.scheduleInterview(intrviewTittle, 'doe', appDate)
        for (const status of statuses) {
            await recruitmentPage.moveThroughWorkflow(status)
        }
        const candidatStatus = await recruitmentPage.getCandidateStatus();
        await recruitmentPage.switchTab(TabName.Candidates);
        await recruitmentPage.fillAutocompleteField('Candidate Name', data.lastName)
        await recruitmentPage.fillInput('Keywords', data.keyword);
        await recruitmentPage.clickBtn('Search')
        await recruitmentPage.checkTableCellValue(
            data.fullName,
            data.vacancy,
            data.dateValue,
            candidatStatus
        )
    });
})