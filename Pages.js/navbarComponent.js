const { expect } = require("@playwright/test");

/**
 * Navbar / Navigation Component Object Model
 * Encapsulates global top-level navigation, user session info, and authentication actions.
 */
class navbarComponent {
    constructor(page) {
        this.page = page;

        this.homeButton = page.locator("#nav-home");
        this.eventButton = page.locator("#nav-events");
        this.bookingButton = page.locator("#nav-bookings");
        this.adminButton = page.getByRole("button", { name: "Admin" });
        this.logoutButton = page.locator("#logout-btn");
        this.userEmailDisplay = page.getByTestId("user-email-display");
    }

    async navigateToHome() {
        await this.homeButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/");
    }

    async navigateToEvents() {
        await this.eventButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/events");
    }

    async navigateToBookings() {
        await this.bookingButton.click();
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(/.*login/);
    }

    async verifyUserEmail(expectedEmail) {
        await expect(this.userEmailDisplay).toHaveText(expectedEmail);
    }

    async verifyLogoutButtonVisible() {
        await expect(this.logoutButton).toBeVisible();
        await expect(this.logoutButton).toBeEnabled();
    }
}

module.exports = { navbarComponent };
