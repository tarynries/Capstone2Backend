// const express = require("express");
const request = require("supertest");
const app = require("../app");
const db = require("../db");

// const app = express();
// const router = require("./path/to/router"); // Replace with the actual path to your router file
// app.use("/", router);

describe("Grocery List API", () => {
    describe("POST /", () => {
        it("should add a new item to the grocery list", async () => {
            const newItem = { name: "Test Item" };

            const response = await request(app)
                .post("/api/shopping-list")
                .send(newItem)
                .expect(201);

            expect(response.body.name).toBe(newItem.name);
            expect(response.body.id).toBeDefined();;
        });
    });

    describe("GET /api/shopping-list", () => {
        it("should fetch the grocery list", async () => {

            const response = await request(app)
                .get("/api/shopping-list")
                .expect(200)
                .expect("Content-Type", /json/)


            expect(response.body).toEqual(expect.any(Array));
            expect(response.body.length).toBeGreaterThan(0);
        });
    });


    describe("DELETE /:id", () => {
        it("should remove an item from the grocery list", async () => {
            const itemId = 1;

            const response = await request(app)
                .delete(`/api/shopping-list/${itemId}`)
                .expect(200);

            expect(response.body.message).toEqual("Item removed successfully");
        });
    });
});
