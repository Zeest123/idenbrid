const express = require("express");
let cors = require("cors");
const fileUpload = require("express-fileupload");

const { errorHandler } = require("../src/middleware/errorMiddleware"),
  sync = require("../src/routes/sync"),
  seeder = require("../src/routes/seeder/seeder"),
  user = require("../src/routes/users/users");
product = require("../src/routes/product/product");
// profilePic = require("../src/routes/users/profilePictures");

module.exports = function (app) {
  app.use(express.static("public"));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());
  app.use(fileUpload());

  app.use("/sync-database", sync);
  app.use("/seeder", seeder);
  app.use("/users", user);
  app.use("/product", product);
  // app.use("/profile_pic", profilePic);

  app.use(errorHandler);
};
