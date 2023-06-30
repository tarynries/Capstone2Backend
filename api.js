const axios = require("axios");

const api = axios.create({
    baseURL: 'https://api.spoonacular.com', // Base URL for the API requests
    params: {
        apiKey: '66a73a7cd6c84d138abe08a3b2ded76e'
    }
});

module.exports = api;