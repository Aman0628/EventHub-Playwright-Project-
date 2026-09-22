const { test } = require("playwright/test")
const testData = require("../Utils.js/testData.json");
const { POmanager } = require("../Pages.js/poManager");

for (const data of testData) {

    test(`login test - ${data.testcase}`, async ({ page }) => {

        const poManager = new POmanager(page);
        const loginpage = poManager.getmeLoginpage();

        await loginpage.goto();
        await loginpage.validateLogin(data.username, data.password);

        if (data.shouldLogin) {
            await loginpage.verifySuccessfullLogin();
        } else {
            await loginpage.verifyErrorMessage(data.errorMessage);
        }
    })
}