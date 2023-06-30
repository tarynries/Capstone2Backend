const app = require('./app');
const config = require("./config");

app.listen(config.PORT, function () {
    console.log(`Started on http://localhost:${config.PORT}`);
});
