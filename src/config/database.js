const Sequelize = require("sequelize");

const sequelize = new Sequelize("color_management", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
