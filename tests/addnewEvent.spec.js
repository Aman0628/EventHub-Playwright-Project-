const { test, expect } = require("@playwright/test")
const { POmanager } = require("../Pages.js/poManager")
const testData = require("../Utils.js/testData.json")

test.beforeEach(async ({ page }) => {

    const poManager = new POmanager(page);
    const loginPage = poManager.getmeLoginpage();

    const data = testData.find(x => x.shouldLogin === true);

    await loginPage.goto();
    await loginPage.validateLogin(data.username, data.password);
    await loginPage.verifySuccessfullLogin();

    })

test("add new event ", async ({page}) => {

    const poManager = new POmanager(page);
    const dashboardPage = poManager.getmedashboardPage();
    const addneweventPage = poManager.getmeaddneweventPage();

    await dashboardPage.verifyeventButton();
    await addneweventPage.addnewEvent();
    await addneweventPage.fillEventDetails();



})