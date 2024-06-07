const { Users } = require("../models/users"),
  { LogException } = require("../models/logException"),
  { UnhandleException } = require("../models/unhandleException"),
  { Pictures } = require("../models/pictures"),
  { Products } = require("../models/products"),
  { Color } = require("../models/color"),
  { Tones } = require("../models/tones");

const syncDatabase = async () => {
  await Users.sync({ alter: true });
  await Products.sync({ alter: true });
  await Color.sync({ alter: true });
  await Tones.sync({ alter: true });
  await Pictures.sync({ alert: true }); // profile picture
  await LogException.sync({ alter: true });
  await UnhandleException.sync({ alter: true });
};

module.exports = {
  syncDatabase,
};
