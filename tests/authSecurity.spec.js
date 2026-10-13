const { test, expect } = require("@playwright/test");
const { POmanager } = require("../Pages.js/poManager");

test.describe("Authentication Security & Validation Suite", () => {
    test("should ensure password field is masked with type='password'", async ({ page }) => {
        const poManager = new POmanager(page);
        const loginPage = poManager.getmeLoginpage();

        await loginPage.goto();
        await expect(loginPage.password).toHaveAttribute("type", "password");
    });

    test("should prevent submission with empty credentials", async ({ page }) => {
        const poManager = new POmanager(page);
        const loginPage = poManager.getmeLoginpage();

        await loginPage.goto();
        await loginPage.signinButton.click();

        // Verifies user remains on the login page and is not authenticated
        await expect(page).toHaveURL(/.*login/);
    });

    test("should redirect unauthenticated users away from protected routes", async ({ page }) => {
        // Attempting to visit /bookings directly without authenticating
        await page.goto("https://eventhub.rahulshettyacademy.com/bookings");

        // Application must redirect back to login
        await expect(page).toHaveURL(/.*login/);
    });
});
