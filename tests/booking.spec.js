const { test, expect } = require("@playwright/test");
const { POmanager } = require("../Pages.js/poManager");
const testData = require("../Utils.js/testData.json");

test.describe("Event Booking End-to-End Suite", () => {
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

    test("should successfully book multiple tickets and verify booking reference in My Bookings", async ({ page }) => {
        const poManager = new POmanager(page);
        const bookingPage = poManager.getmeconfirmbookingPage();

        // 1. Select first available event to book
        await bookingPage.clickFirstBookNow();

        // 2. Adjust ticket count to 2
        await bookingPage.adjustTicketQuantity(2);

        // 3. Fill booking customer details
        const customerDetails = {
            name: "Automated Tester",
            email: "akori84411@gmail.com",
            phone: "9876543210"
        };
        await bookingPage.fillBookingDetails(customerDetails);

        // 4. Submit booking and capture response
        const bookingResponse = await bookingPage.submitBooking();
        expect(bookingResponse.success).toBeTruthy();
        expect(bookingResponse.data).toBeDefined();

        const bookingRef = bookingResponse.data.bookingRef;

        // 5. Navigate to My Bookings and verify the specific booking reference appears
        await bookingPage.navigateToMyBookings();
        if (bookingRef) {
            await bookingPage.verifyBookingInList(bookingRef);
        }
    });
});

