const express = require("express");
const api = require("../api");
const db = require("../db");
const { NotFoundError } = require("../expressError");

const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        // Fetch jokes from the api 
        const response = await api.get("/food/jokes/random", {
            params: {
                number: 10,
            },
            headers: {
                Accept: "application/json",
            },
        });


        const apiJokes = [];

        if (response.data.text && response.data.text.length > 0) {
            const truncatedJoke = response.data.text;
            const insertedJoke = await db.query(
                `INSERT INTO jokes (text) VALUES ($1) RETURNING id, text`,
                [truncatedJoke]
            );
            apiJokes.push({
                id: insertedJoke.rows[0].id,
                text: insertedJoke.rows[0].text,
            });
        }

        const dbJokes = await db.query("SELECT * FROM jokes");
        const jokes = dbJokes.rows.map((joke) => joke.text);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ jokes });

    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Joke not found");
        }
        return next(err);
    }
});

module.exports = router;
