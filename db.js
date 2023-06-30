"use strict";

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Client({
    connectionString: getDatabaseUri(),
});

db.connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
        process.exit(1); // Exit the process with a non-zero status code
    });

module.exports = db;

