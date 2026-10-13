const { test, expect } = require("@playwright/test");
const { ApiHelper } = require("../../Utils.js/apiHelper");
const { POmanager } = require("../../Pages.js/poManager");
const testData = require("../../Utils.js/testData.json");

/**
 * ============================================================================
 * STAGE 4: HYBRID API + UI TESTING (INDUSTRY BEST PRACTICE)
 * ============================================================================
 * 
 * WHY HYBRID TESTING IS POWERFUL:
 * - FAST SETUP: Creates test prerequisites via API in 200ms instead of clicking
 *   through 5 UI screens.
 * - FOCUSED UI VALIDATION: The browser only tests the specific UI feature
 *   under test (in this case: visually seeing and interacting with the booking card).
 * - RELIABLE CLEANUP: Cleans up test data via API even if the UI test fails.
 */

test.describe("Stage 4 - Hybrid API + UI Suite", () => {
    let api;
    let token;
    let createdBooking;
    const validUser = testData.find(x => x.shouldLogin === true);

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);

        // 1. Authenticate via API
        const auth = await api.login(validUser.username, validUser.password);
        token = auth.token;

        // 2. Fetch first available event
        const eventsRes = await api.getEvents(token, { page: 1, limit: 1 });
        const eventId = eventsRes.body.data[0].id;

        // 3. Fast Data Setup: Create booking via API in milliseconds!
        const bookingRes = await api.createBooking(token, {
            eventId,
            customerName: "Hybrid Automated Tester",
            customerEmail: validUser.username,
            customerPhone: "9876543210",
            quantity: 1,
        });

        createdBooking = bookingRes.body.data;
        expect(createdBooking.bookingRef).toBeDefined();
    });

    test.afterEach(async () => {
        // Teardown: Clean up test booking via API if still present
        if (createdBooking?.id) {
            await api.cancelBooking(token, createdBooking.id).catch(() => {});
        }
    });

    test("setup booking via API -> visually verify & cancel via UI", async ({ page }) => {
        const poManager = new POmanager(page);
        const loginPage = poManager.getmeLoginpage();
        const dashboardPage = poManager.getmedashboardPage();
        const bookingPage = poManager.getmeconfirmbookingPage();

        // --------------------------------------------------------------------
        // Step 1: Login via UI
        // --------------------------------------------------------------------
        await loginPage.goto();
        await loginPage.validateLogin(validUser.username, validUser.password);
        await loginPage.verifySuccessfullLogin();

        // --------------------------------------------------------------------
        // Step 2: Navigate to My Bookings in UI
        // --------------------------------------------------------------------
        await dashboardPage.verifybookingButton();

        // --------------------------------------------------------------------
        // Step 3: Visually verify the API-created booking reference appears in UI
        // --------------------------------------------------------------------
        await bookingPage.verifyBookingInList(createdBooking.bookingRef);

        // --------------------------------------------------------------------
        // Step 4: Cancel the booking directly via UI
        // --------------------------------------------------------------------
        await bookingPage.cancelBookingByRef(createdBooking.bookingRef);
    });

});
