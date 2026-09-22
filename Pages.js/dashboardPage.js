const { expect } = require("playwright/test")

class dashboardPage {

    constructor(page) {
        this.page = page;

        this.eventButton = page.locator("#nav-events");
        this.bookingButton = page.locator("#nav-bookings");
        this.adminButton = page.locator("getByRole('button', { name: 'Admin' })");
        this.logoutButton = page.locator("getByTestId('logout-btn')");
    }
    async verifyeventButton() {
        await this.eventButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/events");
    }
    async verifybookingButton() {
        await this.bookingButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    }
}
module.exports = { dashboardPage }