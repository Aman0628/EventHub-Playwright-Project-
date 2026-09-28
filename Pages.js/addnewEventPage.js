class addNewEvent {

    constructor(page) {
        this.page = page;

        this.addEventButton = page.getByRole("button", { name: "Add New Event" });
        this.eventTitle = page.locator("#event-title-input");
        this.category = page.locator("#category");
        this.city = page.getByPlaceholder("e.g. Bangalore");
        this.venueAddress = page.getByPlaceholder("Venue name & address");
        this.dateTime = page.locator('[id="event-date-&-time"]');
        this.price = page.getByPlaceholder('0.00');
        this.seats = page.getByPlaceholder("e.g. 500");
        this.addButton = page.getByRole("button", { name: "+ Add Event" });
    }

    async addnewEvent() {

        this.addEventButton.click();
    }

    async fillEventDetails() {

        await this.eventTitle.fill("house party");
        await this.category.selectOption("Festival");
        await this.city.fill("Mohali");
        await this.venueAddress.fill("sec66");
        await this.dateTime.fill("2026-11-28T13:30");
        await this.price.fill("100");
        await this.seats.fill("10");
        await this.addButton.click();
    }
}
module.exports = { addNewEvent }