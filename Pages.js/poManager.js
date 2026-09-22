const { loginPage } = require("../Pages.js/loginPage")

class POmanager {

    constructor(page) {
        this.page = page;
        this.loginpage = new loginPage(page);
    }

    getmeLoginpage() {
        return this.loginpage;
    }
}module.exports = { POmanager };