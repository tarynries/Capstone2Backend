const request = require("supertest");
const app = require("../app");
const api = require("../api");
const db = require("../db");



describe("Jokes API", () => {
    describe("GET /", () => {
        it("should fetch jokes from the API and store them in the database", async () => {
            // Clear the test database before the test
            await db.query("DELETE FROM jokes");

            await db.query(`INSERT INTO jokes (id, text)
            VALUES (1, 'Test Joke')`);

            // Make the request
            const response = await request(app).get("/jokes")
                .expect(200);

            // Get the jokes from the test database
            const dbJokes = await db.query("SELECT * FROM jokes");
            const jokes = dbJokes.rows.map((joke) => joke.text);

            // Assertions
            expect(response.body.jokes).toEqual(jokes);
            expect(dbJokes.rows.length).toBeGreaterThan(0);
        });
    });
});


