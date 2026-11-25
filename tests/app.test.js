const request = require("supertest");
const app = require("../app");

describe("HustleHub API", () => {
    test("GET unknown route returns 404", async () => {
        const response = await request(app)
            .get("/api/this-route-does-not-exist");

        expect(response.statusCode).toBe(404);
    });
});