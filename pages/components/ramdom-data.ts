import { faker } from "@faker-js/faker";

export function generateData() {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number({style: 'international'}),
        keyword: faker.lorem.sentence(),
        note: faker.lorem.sentence(),
        vacancyName: faker.person.jobTitle(),
        description: faker.company.catchPhraseDescriptor(),
        id: faker.string.numeric(5),
        username: faker.internet.username(),
        password: faker.internet.password({ pattern: /[A-Z0-9a-z\W]/ }) + 1
    };
}