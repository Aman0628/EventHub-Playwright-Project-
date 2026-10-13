const { test, expect } = require("@playwright/test");
const { POmanager } = require("../../Pages.js/poManager");
const testData = require("../../Utils.js/testData.json");

test.describe("Events Search & Filter Tests", () => {
    test.beforeEach(async ({ page }) => {
        const poManager = new POmanager(page);
        const loginPage = poManager.getmeLoginpage();
        const data = testData.find(x => x.shouldLogin === true);

        await loginPage.goto();
        await loginPage.validateLogin(data.username, data.password);
        await loginPage.verifySuccessfullLogin();

        const dashboardPage = poManager.getmedashboardPage();
        await dashboardPage.verifyeventButton();
    });

    test("should filter events by category", async ({ page }) => {
        const poManager = new POmanager(page);
        const eventPage = poManager.getmeeventPage();

        await eventPage.filterByCategory("Festival");
        await expect(eventPage.eventCards).not.toHaveCount(0);
        await expect(eventPage.eventCards.first()).toContainText("Festival");
    });

    test("should display empty state when searching for a non-existent event", async ({ page }) => {
        const poManager = new POmanager(page);
        const eventPage = poManager.getmeeventPage();

        await eventPage.searchEvent("NonExistentEventXYZ999");
        await eventPage.verifyNoEventsMessage();
    });

    test("should filter events by city", async ({ page }) => {
        const poManager = new POmanager(page);
        const eventPage = poManager.getmeeventPage();

        await eventPage.filterByCity("Delhi");
        await expect(eventPage.eventCards).not.toHaveCount(0);
        await expect(eventPage.eventCards.first()).toContainText("Delhi");
    });


});

