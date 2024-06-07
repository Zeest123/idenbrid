const http = require("http");
const express = require("express");

require("dotenv").config();
require("./src/controllers/association")();

app = express();

const server = http.createServer(app);
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

require("./startup/prod")(app);

const port = process.env.PORT || 6062;

server.listen(port, () => console.log(`Server started on port ${port}`));
// server.listen(port, () => logger.info(`Server started on port ${port}`));
