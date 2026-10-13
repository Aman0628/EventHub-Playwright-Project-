const { expect } = require("@playwright/test");

class confirmBooking {
    constructor(page) {
        this.page = page;
        this.bookNowButtons = page.locator('[data-testid="book-now-btn"], #book-now-btn');
        this.customerNameInput = page.locator('#customerName');
        this.customerEmailInput = page.locator('#customer-email');
        this.customerPhoneInput = page.locator('#phone');
        this.confirmBookingButton = page.locator('#confirm-booking');
        this.increaseTicketButton = page.getByRole('button', { name: '+' });
        this.decreaseTicketButton = page.getByRole('button', { name: '−' });
        this.myBookingsTitle = page.getByRole('heading', { name: 'My Bookings' });
        this.clearAllBookingsButton = page.getByRole('button', { name: 'Clear all bookings' });
    }

    async clickFirstBookNow() {
        await this.bookNowButtons.first().click();
        await this.page.waitForURL('**/events/*');
    }

    async selectEventByName(eventName) {
        const card = this.page.locator('article', { hasText: eventName });
        await card.locator('[data-testid="book-now-btn"], #book-now-btn').click();
        await this.page.waitForURL('**/events/*');
    }

    async adjustTicketQuantity(targetQuantity = 1) {
        for (let i = 1; i < targetQuantity; i++) {
            await this.increaseTicketButton.click();
        }
    }

    async fillBookingDetails({ name = "Test User", email = "akori84411@gmail.com", phone = "9876543210" } = {}) {
        await this.customerNameInput.fill(name);
        await this.customerEmailInput.fill(email);
        await this.customerPhoneInput.fill(phone);
    }

    async submitBooking() {
        const responsePromise = this.page.waitForResponse(
            res => res.url().includes('/api/bookings') && res.request().method() === 'POST'
        );
        await this.confirmBookingButton.click();
        const response = await responsePromise;
        expect(response.ok()).toBeTruthy();
        return await response.json();
    }

    async navigateToMyBookings() {
        await this.page.locator('#nav-bookings').click();
        await this.page.waitForURL('**/bookings');
        await expect(this.myBookingsTitle).toBeVisible();
    }

    async verifyBookingInList(bookingRef) {
        await expect(this.page.getByText(bookingRef)).toBeVisible();
    }

    async cancelBookingByRef(bookingRef) {
        const card = this.page.locator('div', { hasText: bookingRef });
        const cancelBtn = card.getByRole('button', { name: 'Cancel Booking' }).first();
        if (await cancelBtn.isVisible()) {
            await cancelBtn.click();
        }
    }

    async clearAllBookings() {
        if (await this.clearAllBookingsButton.isVisible()) {
            await this.clearAllBookingsButton.click();
        }
    }
}

module.exports = { confirmBooking };
