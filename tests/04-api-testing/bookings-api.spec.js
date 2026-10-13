const { test, expect } = require("@playwright/test");
const { ApiHelper } = require("../../Utils.js/apiHelper");
const testData = require("../../Utils.js/testData.json");

/**
 * ============================================================================
 * STAGE 4: PURE API TESTING - BOOKINGS CRUD LIFECYCLE
 * ============================================================================
 * 
 * TESTS THE FULL BOOKING LIFECYCLE THROUGH REST APIS:
 * 1. Create a booking via POST /api/bookings (Status 201)
 * 2. Retrieve user bookings via GET /api/bookings (Status 200)
 * 3. Cancel the booking via DELETE /api/bookings/:id (Status 200)
 * 4. Error validation on malformed requests
 */

test.describe("Stage 4 - Bookings API Lifecycle Suite", () => {
    let api;
    let token;
    let availableEventId;
    const validUser = testData.find(x => x.shouldLogin === true);

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);

        const auth = await api.login(validUser.username, validUser.password);
        token = auth.token;

        const eventsRes = await api.getEvents(token, { page: 1, limit: 1 });
        availableEventId = eventsRes.body.data[0].id;
    });

    test("complete API lifecycle: Create -> Verify in List -> Cancel Booking", async () => {
        // --------------------------------------------------------------------
        // Step 1: Create Booking via API
        // --------------------------------------------------------------------
        const bookingPayload = {
            eventId: availableEventId,
            customerName: "API Automation User",
            customerEmail: validUser.username,
            customerPhone: "9876543210",
            quantity: 2,
        };

        const { response: createRes, body: createBody } = await api.createBooking(token, bookingPayload);

        expect(createRes.status()).toBe(201);
        expect(createBody.success).toBeTruthy();
        expect(createBody.data).toBeDefined();

        const createdBookingId = createBody.data.id;
        const bookingRef = createBody.data.bookingRef;
        expect(createdBookingId).toBeDefined();
        expect(bookingRef).toMatch(/^D-[A-Z0-9]+$/);

        // --------------------------------------------------------------------
        // Step 2: Retrieve Bookings & Verify Created Booking is Present
        // --------------------------------------------------------------------
        const { response: getRes, body: getBody } = await api.getBookings(token);

        expect(getRes.status()).toBe(200);
        expect(getBody.success).toBeTruthy();

        const found = getBody.data.some(b => b.id === createdBookingId || b.bookingRef === bookingRef);
        expect(found).toBeTruthy();

        // --------------------------------------------------------------------
        // Step 3: Cancel Booking via API (Cleanup)
        // --------------------------------------------------------------------
        const { response: cancelRes, body: cancelBody } = await api.cancelBooking(token, createdBookingId);

        expect(cancelRes.status()).toBe(200);
        expect(cancelBody.success).toBeTruthy();
        expect(cancelBody.message).toMatch(/cancelled/i);
    });

    test("POST /api/bookings - rejects booking with invalid / missing payload", async () => {
        // Missing required fields
        const invalidPayload = {
            eventId: availableEventId,
            customerName: "",
            customerEmail: "invalid-email-format",
            quantity: 0,
        };

        const { response, body } = await api.createBooking(token, invalidPayload);

        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(body.success).toBeFalsy();
    });

});
