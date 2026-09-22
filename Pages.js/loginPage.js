const { expect } = require("playwright/test");

class loginPage {
    constructor(page) {
        this.page = page;
        this.username = page.getByPlaceholder("you@email.com");
        this.password = page.getByPlaceholder("••••••");
        this.signinButton = page.locator("#login-btn");

        this.errorMessage = page.getByText('Invalid email or password');

    }
    async goto() {
        await this.page.goto("https://eventhub.rahulshettyacademy.com/login");
    }
    async validateLogin(username, password) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signinButton.click();
    }
    async verifySuccessfullLogin() {
        await expect(this.page).toHaveURL("https://eventhub.rahulshettyacademy.com/");
    }
    async verifyErrorMessage(expectedMessage) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
}
}
module.exports = { loginPage }