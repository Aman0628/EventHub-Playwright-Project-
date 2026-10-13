const { test, expect } = require("@playwright/test");
const { ApiHelper } = require("../../Utils.js/apiHelper");
const testData = require("../../Utils.js/testData.json");

/**
 * ============================================================================
 * STAGE 4: PURE API TESTING - AUTHENTICATION & EVENTS
 * ============================================================================
 * 
 * WHY PURE API TESTS ARE ESSENTIAL:
 * - Extremely fast (~100-300ms per test vs 3-5 seconds for UI tests).
 * - Tests backend business logic directly without browser overhead.
 * - Validates HTTP status codes, headers, and JSON response schemas.
 */

test.describe("Stage 4 - Events & Auth API Suite", () => {
    let api;
    const validUser = testData.find(x => x.shouldLogin === true);

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test("POST /api/auth/login - valid credentials return 200 and JWT token", async () => {
        const { response, body, token } = await api.login(validUser.username, validUser.password);

        expect(response.status()).toBe(200);
        expect(body.success).toBeTruthy();
        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
        expect(body.user.email).toBe(validUser.username);
    });

    test("POST /api/auth/login - invalid credentials return 400 or 401 status", async () => {
        const { response, body } = await api.login("invalid_user@test.com", "WrongPassword123!");

        expect([400, 401]).toContain(response.status());
        expect(body.success).toBeFalsy();
    });

    test("GET /api/events - unauthenticated request is rejected with 401", async ({ request }) => {
        const response = await request.get("https://api.eventhub.rahulshettyacademy.com/api/events");

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.success).toBeFalsy();
    });

    test("GET /api/events - authenticated request returns 200 and list of events", async () => {
        const { token } = await api.login(validUser.username, validUser.password);
        const { response, body } = await api.getEvents(token, { page: 1, limit: 5 });

        expect(response.status()).toBe(200);
        expect(body.success).toBeTruthy();
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBeGreaterThan(0);

        // Validate event schema
        const firstEvent = body.data[0];
        expect(firstEvent).toHaveProperty("id");
        expect(firstEvent).toHaveProperty("title");
        expect(firstEvent).toHaveProperty("category");
        expect(firstEvent).toHaveProperty("venue");
        expect(firstEvent).toHaveProperty("price");
    });

    test("GET /api/events - validates pagination limit parameter", async () => {
        const { token } = await api.login(validUser.username, validUser.password);
        const limit = 3;
        const { response, body } = await api.getEvents(token, { page: 1, limit });

        expect(response.status()).toBe(200);
        expect(body.data.length).toBeLessThanOrEqual(limit);
    });

});
