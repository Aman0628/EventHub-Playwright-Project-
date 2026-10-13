const { test, expect } = require("@playwright/test");
const { POmanager } = require("../Pages.js/poManager");
const testData = require("../Utils.js/testData.json");

test.beforeEach(async ({ page }) => {
    const poManager = new POmanager(page);
    const loginPage = poManager.getmeLoginpage();

    const data = testData.find(x => x.shouldLogin === true);

    await loginPage.goto();
    await loginPage.validateLogin(data.username, data.password);
    await loginPage.verifySuccessfullLogin();
});

test("verifying dashboard navigation buttons", async ({ page }) => {
    const poManager = new POmanager(page);
    const dashboardPage = poManager.getmedashboardPage();

    await dashboardPage.verifyeventButton();
    await dashboardPage.verifybookingButton();
    await dashboardPage.verifyHomeButton();
});

test("verifying user email display on dashboard", async ({ page }) => {
    const poManager = new POmanager(page);
    const dashboardPage = poManager.getmedashboardPage();
    const data = testData.find(x => x.shouldLogin === true);

    await dashboardPage.verifyUserEmail(data.username);
});

test("verifying user logout flow", async ({ page }) => {
    const poManager = new POmanager(page);
    const dashboardPage = poManager.getmedashboardPage();

    await dashboardPage.logout();
});