const { loginPage } = require("../Pages.js/loginPage")
const { dashboardPage } = require("../Pages.js/dashboardPage")
const { addNewEvent } = require("../Pages.js/addnewEventPage")
const { confirmBooking } = require("../Pages.js/conifrmBooking")

class POmanager {

    constructor(page) {
        this.page = page;
        this.loginpage = new loginPage(page);
        this.dashboardpage = new dashboardPage(page);
        this.addneweventpage = new addNewEvent(page);
        this.findeventpage = new confirmBooking(page);
        this.confirmbookingpage = new confirmBooking(page);
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
    getmeeventPage() {
        return this.findeventpage;
    }
    getmeconfirmbookingPage() {
        return this.confirmbookingpage;
    }
} module.exports = { POmanager };