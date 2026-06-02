Playwright UI Automation Framework

An automated testing framework for the OrangeHRM web application built with Playwright and TypeScript.

Tech Stack
Playwright
TypeScript
Node.js
Page Object Model (POM)
Playwright Fixtures

Project Structure
project-root/
│
├── pages/              # Page Object classes
├── tests/              # Test cases
├── fixtures/           # Custom fixtures
├── utils/              # Helper functions
├── playwright.config.ts
├── package.json
└── README.md

Features
Page Object Model (POM) architecture
Reusable Playwright fixtures
Dynamic test data generation
UI validation and assertions
Employee management test scenarios
Login and authentication testing

Installation

Clone the repository:
git clone <repository-url>
cd project-name

Install dependencies:
npm install
Environment Variables

Create a .env file in the project root:
BASE_URL=http://localhost:8081/web/index.php/
USER=Admin
PASSWORD=Admin123
Running Tests

Run all tests:
npm test

Run tests in headed mode:
npm run test:headed

Open Playwright UI mode:
npm run test:ui

Generate and open the test report:
npm run report

Test Scenarios
Login
Valid login
Invalid login
Logout

Employee Management
Add an employee
Edit employee details
Delete an employee
Verify employee information

Design Patterns
Page Object Model

Each page object contains:

Locators
Actions
Assertions

Example:

await loginPage.login(username, password);
await dashboardPage.verifyDashboard();