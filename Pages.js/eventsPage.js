const { expect } = require("@playwright/test");

class eventsPage {
    constructor(page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder("Search events, venues…");
        this.categorySelect = page.locator("select").nth(0);
        this.citySelect = page.locator("select").nth(1);
        this.eventCards = page.locator("article");
        this.noEventsMessage = page.getByText(/no events found/i);
    }

    async searchEvent(query) {
        await this.searchInput.fill(query);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async filterByCategory(category) {
        const responsePromise = this.page.waitForResponse(
            res => res.url().includes('/api/events') && res.status() === 200
        );
        await this.categorySelect.selectOption(category);
        await responsePromise;
    }

    async filterByCity(city) {
        const responsePromise = this.page.waitForResponse(
            res => res.url().includes('/api/events') && res.status() === 200
        );
        await this.citySelect.selectOption(city);
        await responsePromise;
    }


    async getEventCardsCount() {
        return await this.eventCards.count();
    }

    async verifyNoEventsMessage() {
        await expect(this.noEventsMessage).toBeVisible();
    }
}

module.exports = { eventsPage };
