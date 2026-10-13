const { loginPage } = require("./loginPage");
const { dashboardPage } = require("./dashboardPage");
const { addNewEvent } = require("./addnewEventPage");
const { confirmBooking } = require("./confirmBookingPage");
const { eventsPage } = require("./eventsPage");

class POmanager {

    constructor(page) {
        this.page = page;
        this.loginpage = new loginPage(page);
        this.dashboardpage = new dashboardPage(page);
        this.addneweventpage = new addNewEvent(page);
        this.findeventpage = new eventsPage(page);
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
}

module.exports = { POmanager };