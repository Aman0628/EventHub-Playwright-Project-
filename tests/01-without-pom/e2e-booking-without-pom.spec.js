const { test, expect } = require("@playwright/test");

/**
 * ============================================================================
 * STAGE 1: END-TO-END FLOW WITHOUT PAGE OBJECT MODEL (POM)
 * ============================================================================
 * 
 * CHARACTERISTICS OF THIS APPROACH:
 * - Direct, procedural script using raw Playwright locators (`page.locator`, `page.getByRole`, etc.).
 * - No classes, abstractions, or helper files required.
 * - Simple and fast to write for initial scripts or quick proof-of-concepts.
 * 
 * DRAWBACKS AS A PROJECT GROWS:
 * - Duplicate locators across different test files (e.g., `#login-btn` copied everywhere).
 * - If UI elements change, every single test script containing that selector must be updated.
 * - Test files become long and mix test intent with low-level page interactions.
 */

test.describe("Stage 1 - Raw E2E Flow (No POM)", () => {

    test("complete user journey: Login -> Book Event -> Verify Booking -> Logout", async ({ page }) => {

        // --------------------------------------------------------------------
        // Step 1: Navigate to Login Page
        // --------------------------------------------------------------------
        await page.goto("https://eventhub.rahulshettyacademy.com/login");
        await expect(page).toHaveTitle(/EventHub|Login/i);

        // --------------------------------------------------------------------
        // Step 2: Fill Credentials & Submit Login
        // --------------------------------------------------------------------
        await page.getByPlaceholder("you@email.com").fill("akori84411@gmail.com");
        await page.getByPlaceholder("••••••").fill("Bhull@kd12");
        await page.locator("#login-btn").click();

        // Verify successful login by checking redirect to Dashboard
        await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/");
        await expect(page.locator("#logout-btn")).toBeVisible();

        // --------------------------------------------------------------------
        // Step 3: Navigate to Events Page
        // --------------------------------------------------------------------
        await page.locator("#nav-events").click();
        await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/events");

        // --------------------------------------------------------------------
        // Step 4: Select First Available Event
        // --------------------------------------------------------------------
        const bookNowButtons = page.locator('[data-testid="book-now-btn"], #book-now-btn');
        await expect(bookNowButtons.first()).toBeVisible();
        await bookNowButtons.first().click();

        // Verify redirected to event details page
        await page.waitForURL("**/events/*");

        // --------------------------------------------------------------------
        // Step 5: Adjust Ticket Quantity (Increase to 2)
        // --------------------------------------------------------------------
        const increaseTicketButton = page.getByRole("button", { name: "+" });
        await increaseTicketButton.click();

        // --------------------------------------------------------------------
        // Step 6: Fill Customer Booking Form
        // --------------------------------------------------------------------
        await page.locator("#customerName").fill("Automated Tester");
        await page.locator("#customer-email").fill("akori84411@gmail.com");
        await page.locator("#phone").fill("9876543210");

        // --------------------------------------------------------------------
        // Step 7: Submit Booking & Capture API Response
        // --------------------------------------------------------------------
        const bookingResponsePromise = page.waitForResponse(
            res => res.url().includes("/api/bookings") && res.request().method() === "POST"
        );

        await page.locator("#confirm-booking").click();

        const bookingResponse = await bookingResponsePromise;
        expect(bookingResponse.ok()).toBeTruthy();

        const responseBody = await bookingResponse.json();
        expect(responseBody.success).toBeTruthy();
        const bookingRef = responseBody.data?.bookingRef;

        // --------------------------------------------------------------------
        // Step 8: Navigate to My Bookings and Verify Booking Reference
        // --------------------------------------------------------------------
        await page.locator("#nav-bookings").click();
        await page.waitForURL("**/bookings");
        await expect(page.getByRole("heading", { name: "My Bookings" })).toBeVisible();

        if (bookingRef) {
            await expect(page.getByText(bookingRef)).toBeVisible();
        }

        // --------------------------------------------------------------------
        // Step 9: Logout User
        // --------------------------------------------------------------------
        await page.locator("#logout-btn").click();
        await expect(page).toHaveURL(/.*login/);
    });

});
