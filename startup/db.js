// const winston = require("winston");
const sequelize = require("../src/config/database");

module.exports = function () {
  sequelize.authenticate().then(() => console.log("Database is connected"));
  // sequelize.authenticate().then(() => logger.info("Database is connected"));
  // .catch((err) => console.log(`Error: ${err}`));
};
