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


        const MAX_JOKE_LENGTH = 255;

        const apiJokes = [];

        // Checking joke length and inserting to database
        if (response.data.jokes && response.data.jokes.length > 0) {
            for (const joke of response.data.jokes) {
                const truncatedJoke = joke.text.substring(0, MAX_JOKE_LENGTH);
                const insertedJoke = await db.query(
                    `INSERT INTO jokes (text) VALUES ($1) RETURNING id, text`,
                    [truncatedJoke]
                );
                apiJokes.push({
                    id: insertedJoke.rows[0].id,
                    text: insertedJoke.rows[0].text,
                });
            }
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
