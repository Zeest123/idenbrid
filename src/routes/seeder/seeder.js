const express = require("express");
const route = express.Router();

const { saveSeeder } = require("../../controllers/seederController");

route.get("/", saveSeeder);

module.exports = route;
