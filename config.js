"use strict";

require("dotenv").config();

const config = {
    PORT: process.env.PORT || 3001,
    getDatabaseUri: () => {
        if (process.env.NODE_ENV === "test") {
            return process.env.TEST_DATABASE_URL || "postgresql://localhost/meal_planning_test";
        } else {
            return process.env.DATABASE_URL || "postgresql://localhost/meal_planning";
        }
    },
};

module.exports = config;