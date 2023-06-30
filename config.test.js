const config = require("./config");

describe("config", () => {
    beforeEach(() => {
        // Reset the environment variables before each test
        delete process.env.PORT;
        delete process.env.NODE_ENV;
        delete process.env.TEST_DATABASE_URL;
        delete process.env.DATABASE_URL;
    });

    it("should return default port when PORT environment variable is not set", () => {
        const expectedPort = 3001;
        const actualPort = config.PORT;
        expect(actualPort).toBe(expectedPort);
    });

    it("should return test database URL when NODE_ENV is 'test'", () => {
        process.env.NODE_ENV = "test";
        const expectedDbUri = "postgresql://localhost/meal_planning_test";
        const actualDbUri = config.getDatabaseUri();
        expect(actualDbUri).toBe(expectedDbUri);
    });

    it("should return default database URL when NODE_ENV is not 'test'", () => {
        const expectedDbUri = "postgresql://localhost/meal_planning";
        const actualDbUri = config.getDatabaseUri();
        expect(actualDbUri).toBe(expectedDbUri);
    });

    it("should return TEST_DATABASE_URL environment variable when NODE_ENV is 'test' and TEST_DATABASE_URL is set", () => {
        process.env.NODE_ENV = "test";
        process.env.TEST_DATABASE_URL = "custom_test_db_url";
        const expectedDbUri = "custom_test_db_url";
        const actualDbUri = config.getDatabaseUri();
        expect(actualDbUri).toBe(expectedDbUri);
    });

    it("should return DATABASE_URL environment variable when NODE_ENV is not 'test' and DATABASE_URL is set", () => {
        process.env.DATABASE_URL = "custom_db_url";
        const expectedDbUri = "custom_db_url";
        const actualDbUri = config.getDatabaseUri();
        expect(actualDbUri).toBe(expectedDbUri);
    });
});
