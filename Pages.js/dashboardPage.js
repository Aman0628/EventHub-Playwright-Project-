const { expect } = require("@playwright/test");

class dashboardPage {

    constructor(page) {
        this.page = page;

        this.homeButton = page.locator("#nav-home");
        this.eventButton = page.locator("#nav-events");
        this.bookingButton = page.locator("#nav-bookings");
        this.adminButton = page.getByRole("button", { name: "Admin" });
        this.logoutButton = page.locator("#logout-btn");
        this.userEmailDisplay = page.getByTestId("user-email-display");
    }

    async verifyeventButton() {
        await this.eventButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/events");
    }

    async verifybookingButton() {
        await this.bookingButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    }

    async verifyHomeButton() {
        await this.homeButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/");
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async verifyUserEmail(expectedEmail) {
        await expect(this.userEmailDisplay).toHaveText(expectedEmail);
    }
}

module.exports = { dashboardPage };