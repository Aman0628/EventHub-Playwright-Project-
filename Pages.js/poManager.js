const { loginPage } = require("../Pages.js/loginPage")
const { dashboardPage } = require("../Pages.js/dashboardPage")
const { addNewEvent } = require("../Pages.js/addnewEventPage")

class POmanager {

    constructor(page) {
        this.page = page;
        this.loginpage = new loginPage(page);
        this.dashboardpage = new dashboardPage(page);
        this.addneweventpage = new addNewEvent(page);
    }

    getmeLoginpage() {
        return this.loginpage;
    }
    getmedashboardPage() {
        return this.dashboardpage;
    }
    getmeaddneweventPage() {
        return this.addneweventpage;
    }
}module.exports = { POmanager };