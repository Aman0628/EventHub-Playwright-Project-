const base = require("@playwright/test");
const { POmanager } = require("../../Pages.js/poManager");
const testData = require("../../Utils.js/testData.json");

/**
 * ============================================================================
 * STAGE 3: CUSTOM PLAYWRIGHT FIXTURES
 * ============================================================================
 * 
 * WHY USE PLAYWRIGHT FIXTURES?
 * 1. DEPENDENCY INJECTION: Page objects are automatically initialized and passed
 *    directly into test functions via destructuring ({ dashboardPage, bookingPage }).
 * 2. ZERO BOILERPLATE: Eliminates repetitive `const poManager = new POmanager(page)`
 *    instantiations at the start of every test.
 * 3. REUSABLE SETUP/TEARDOWN: Fixtures can handle preconditions (e.g., auto-login)
 *    and postconditions (e.g., cleanup) in an isolated, declarative manner.
 * 4. ON-DEMAND EXECUTION: Playwright only initializes fixtures that a test actually requests.
 */

exports.test = base.test.extend({

    // ------------------------------------------------------------------------
    // Base Fixture: POmanager instance bound to the current page
    // ------------------------------------------------------------------------
    poManager: async ({ page }, use) => {
        const poManager = new POmanager(page);
        await use(poManager);
    },

    // ------------------------------------------------------------------------
    // Page Object Fixtures (Auto-injected into test arguments)
    // ------------------------------------------------------------------------
    loginPage: async ({ poManager }, use) => {
        await use(poManager.getmeLoginpage());
    },

    dashboardPage: async ({ poManager }, use) => {
        await use(poManager.getmedashboardPage());
    },

    eventsPage: async ({ poManager }, use) => {
        await use(poManager.getmeeventPage());
    },

    bookingPage: async ({ poManager }, use) => {
        await use(poManager.getmeconfirmbookingPage());
    },

    addnewEventPage: async ({ poManager }, use) => {
        await use(poManager.getmeaddneweventPage());
    },

    // ------------------------------------------------------------------------
    // Advanced Workflow Fixture: Pre-authenticated Session
    // Runs login automatically before entering the test body!
    // ------------------------------------------------------------------------
    authenticatedSession: async ({ page, loginPage }, use) => {
        const validUser = testData.find(x => x.shouldLogin === true);
        await loginPage.goto();
        await loginPage.validateLogin(validUser.username, validUser.password);
        await loginPage.verifySuccessfullLogin();

        // Pass authenticated page to the test
        await use(page);
    },
});

exports.expect = base.expect;
