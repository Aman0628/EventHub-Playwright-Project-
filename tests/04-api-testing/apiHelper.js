/**
 * ============================================================================
 * STAGE 4: API HELPER FOR EVENTHUB
 * ============================================================================
 * 
 * Base URL for the EventHub REST API:
 * https://api.eventhub.rahulshettyacademy.com
 */

const API_BASE_URL = "https://api.eventhub.rahulshettyacademy.com/api";

class ApiHelper {
    constructor(request) {
        this.request = request;
    }

    /**
     * Authenticate and return { token, user }
     */
    async login(email, password) {
        const response = await this.request.post(`${API_BASE_URL}/auth/login`, {
            data: { email, password },
        });
        const body = await response.json();
        return { response, body, token: body.token };
    }

    /**
     * Fetch paginated list of events
     */
    async getEvents(token, params = { page: 1, limit: 10 }) {
        const query = new URLSearchParams(params).toString();
        const response = await this.request.get(`${API_BASE_URL}/events?${query}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json();
        return { response, body };
    }

    /**
     * Create a new booking via API
     */
    async createBooking(token, bookingData) {
        const response = await this.request.post(`${API_BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
            data: bookingData,
        });
        const body = await response.json();
        return { response, body };
    }

    /**
     * Get all bookings for the authenticated user
     */
    async getBookings(token) {
        const response = await this.request.get(`${API_BASE_URL}/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json();
        return { response, body };
    }

    /**
     * Cancel a booking by its ID
     */
    async cancelBooking(token, bookingId) {
        const response = await this.request.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json();
        return { response, body };
    }
}

module.exports = { ApiHelper, API_BASE_URL };
