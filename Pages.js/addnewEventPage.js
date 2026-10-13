const { expect } = require("@playwright/test");

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
        await this.addEventButton.click();
    }

    async fillEventDetails(eventData = {}) {
        const title = eventData.title || `Tech Meetup ${Date.now()}`;
        const category = eventData.category || "Festival";
        const city = eventData.city || "Mohali";
        const venue = eventData.venue || "sec66";
        const dateTime = eventData.dateTime || "2026-11-28T13:30";
        const price = eventData.price || "100";
        const seats = eventData.seats || "10";

        await this.eventTitle.fill(title);
        await this.category.selectOption(category);
        await this.city.fill(city);
        await this.venueAddress.fill(venue);
        await this.dateTime.fill(dateTime);
        await this.price.fill(price);
        await this.seats.fill(seats);
        await this.addButton.click();
    }
}

module.exports = { addNewEvent };