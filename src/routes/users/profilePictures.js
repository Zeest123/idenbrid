const express = require("express");
const route = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { body, param, oneOf, check } = require("express-validator");

const {
  createProfilePic,
  retrieveProfilePic,
  updateProfilePic,
} = require("../../controllers/user/profilePicture/profilePicController");

route.post(
  "/create",
  [body("user_id").isUUID(4).withMessage("Please enter a valid user id")],
  protect,
  createProfilePic
);

route.get(
  "/retrieve",
  [body("user_id").isUUID(4).withMessage("Please enter a valid user id")],
  protect,
  retrieveProfilePic
);

route.post(
  "/update",
  [body("user_id").isUUID(4).withMessage("Please enter a valid user id")],
  protect,
  updateProfilePic
);

module.exports = route;
