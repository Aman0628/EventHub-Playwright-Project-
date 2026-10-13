const { test, expect } = require("../../fixtures/customFixtures");

/**
 * ============================================================================
 * STAGE 3: IMPROVED E2E FLOW USING CUSTOM FIXTURES
 * ============================================================================
 * 
 * NOTICE THE KEY IMPROVEMENTS OVER STAGE 1 & STAGE 2:
 * 1. ZERO `new POmanager(page)` boilerplate: All page objects are injected directly!
 * 2. ZERO repetitive `beforeEach` login: The `authenticatedSession` fixture
 *    handles authentication automatically before the test starts.
 * 3. Clean, readable code: The test reads like pure business specifications.
 */

test.describe("Stage 3 - Improved E2E Flow with Custom Fixtures", () => {

    test("complete booking journey with injected page fixtures & auto-authentication", async ({
        authenticatedSession, // Auto-authenticates before test body executes
        dashboardPage,        // Auto-injected dashboard page object
        bookingPage,          // Auto-injected booking page object
    }) => {

        // --------------------------------------------------------------------
        // Step 1: Navigate to Events from Authenticated Dashboard
        // --------------------------------------------------------------------
        await dashboardPage.verifyeventButton();

        // --------------------------------------------------------------------
        // Step 2: Select Event to Book
        // --------------------------------------------------------------------
        await bookingPage.clickFirstBookNow();

        // --------------------------------------------------------------------
        // Step 3: Adjust Ticket Quantity to 2
        // --------------------------------------------------------------------
        await bookingPage.adjustTicketQuantity(2);

        // --------------------------------------------------------------------
        // Step 4: Fill Customer Booking Details
        // --------------------------------------------------------------------
        const customerDetails = {
            name: "Automated Tester",
            email: "akori84411@gmail.com",
            phone: "9876543210",
        };
        await bookingPage.fillBookingDetails(customerDetails);

        // --------------------------------------------------------------------
        // Step 5: Submit Booking & Verify API Response
        // --------------------------------------------------------------------
        const bookingResponse = await bookingPage.submitBooking();
        expect(bookingResponse.success).toBeTruthy();
        expect(bookingResponse.data).toBeDefined();

        const bookingRef = bookingResponse.data.bookingRef;

        // --------------------------------------------------------------------
        // Step 6: Verify Booking Reference in My Bookings
        // --------------------------------------------------------------------
        await bookingPage.navigateToMyBookings();
        if (bookingRef) {
            await bookingPage.verifyBookingInList(bookingRef);
        }

        // --------------------------------------------------------------------
        // Step 7: Clean Logout Flow
        // --------------------------------------------------------------------
        await dashboardPage.logout();
    });

});
