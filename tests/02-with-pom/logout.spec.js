const { test, expect, browser } = require("@playwright/test");
const { POmanager } = require("../../Pages.js/poManager");
const testData = require("../../Utils.js/testData.json");

/**
 * Logout & Session Management Test Suite
 *
 * Covers:
 *  1. Standard logout redirects to login page
 *  2. Session invalidation — protected routes inaccessible after logout
 *  3. Back-button after logout does not restore authenticated session
 *  4. Re-login after logout works correctly
 *  5. Logout button is visible and accessible on the dashboard
 *  6. Multi-tab session invalidation within same browser context
 */

test.describe("Logout & Session Management Suite", () => {
    // Shared helper — logs in with the primary valid user before each test
    async function loginAsValidUser(page) {
        const poManager = new POmanager(page);
        const loginPage = poManager.getmeLoginpage();
        const data = testData.find((x) => x.shouldLogin === true);

        await loginPage.goto();
        await loginPage.validateLogin(data.username, data.password);
        await loginPage.verifySuccessfullLogin();

        return poManager;
    }

    // ─── Test 1: Standard Logout ───────────────────────────────────────────────
    test("should redirect to login page after clicking logout", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        await navbar.logout();

        // Confirm user lands on the login page
        await expect(page).toHaveURL(/.*login/);
    });

    // ─── Test 2: Session Invalidation ─────────────────────────────────────────
    test("should invalidate session — protected route /bookings redirects to login after logout", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        // Logout first
        await navbar.logout();
        await expect(page).toHaveURL(/.*login/);

        // Attempt to navigate directly to a protected route
        await page.goto("https://eventhub.rahulshettyacademy.com/bookings");

        // Should be bounced back to login, not served the bookings page
        await expect(page).toHaveURL(/.*login/);
    });

    // ─── Test 3: Session Invalidation — Events Route ──────────────────────────
    test("should invalidate session — protected route /events redirects to login after logout", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        await navbar.logout();
        await expect(page).toHaveURL(/.*login/);

        await page.goto("https://eventhub.rahulshettyacademy.com/events");
        await expect(page).toHaveURL(/.*login/);
    });

    // ─── Test 4: Browser Back Button After Logout ─────────────────────────────
    test("should not restore authenticated session when pressing the back button after logout", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        // Navigate to events page using navbar
        await navbar.navigateToEvents();

        // Logout from the events page
        await navbar.logout();
        await expect(page).toHaveURL(/.*login/);

        // Simulate browser back button
        await page.goBack();

        // The app must NOT allow access — user should still be on login
        await expect(page).toHaveURL(/.*login/);
    });

    // ─── Test 5: Re-login After Logout ────────────────────────────────────────
    test("should allow user to re-login successfully after logging out", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        // First logout
        await navbar.logout();
        await expect(page).toHaveURL(/.*login/);

        // Re-login with valid credentials
        const loginPage = poManager.getmeLoginpage();
        const data = testData.find((x) => x.shouldLogin === true);

        await loginPage.validateLogin(data.username, data.password);
        await loginPage.verifySuccessfullLogin();

        // Confirm user is back on the dashboard after re-login
        await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/");
    });

    // ─── Test 6: Logout Button Visibility ─────────────────────────────────────
    test("should display a visible and enabled logout button on the dashboard", async ({ page }) => {
        const poManager = await loginAsValidUser(page);
        const navbar = poManager.getmeNavbarComponent();

        // Assert the logout button is rendered and clickable via navbar component
        await navbar.verifyLogoutButtonVisible();
    });

    // ─── Test 7: Multi-Tab Logout (Same Browser Context) ──────────────────────
    test("should reflect logout state in a new tab within the same browser context", async ({ browser }) => {
        // Create an isolated browser context to simulate multi-tab scenario
        const context = await browser.newContext();

        const tab1 = await context.newPage();
        const poManagerTab1 = new POmanager(tab1);
        const loginPageTab1 = poManagerTab1.getmeLoginpage();
        const data = testData.find((x) => x.shouldLogin === true);

        // Login in Tab 1
        await loginPageTab1.goto();
        await loginPageTab1.validateLogin(data.username, data.password);
        await loginPageTab1.verifySuccessfullLogin();

        // Open Tab 2 in the same context (shares cookies/session)
        const tab2 = await context.newPage();
        await tab2.goto("https://eventhub.rahulshettyacademy.com/events");
        // Tab 2 should be authenticated since it shares the context
        await expect(tab2).toHaveURL("https://eventhub.rahulshettyacademy.com/events");

        // Logout from Tab 1 using navbarComponent
        const navbarTab1 = poManagerTab1.getmeNavbarComponent();
        await navbarTab1.logout();
        await expect(tab1).toHaveURL(/.*login/);

        // On Tab 2, refreshing should now reflect the invalidated session
        await tab2.reload();
        await expect(tab2).toHaveURL(/.*login/);

        await context.close();
    });
});
