const { loginPage } = require("../Pages.js/loginPage")
const { dashboardPage } = require("../Pages.js/dashboardPage")

class POmanager {

    constructor(page) {
        this.page = page;
        this.loginpage = new loginPage(page);
        this.dashboardpage = new dashboardPage(page);
    }

    getmeLoginpage() {
        return this.loginpage;
    }
    getmedashboardPage() {
        return this.dashboardpage;
    }
}module.exports = { POmanager };