const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Users, validate } = require("../models/users");
const { Op } = require("sequelize");
// const { UserPictures } = require("../models/userPictures");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers["x-auth-token"]) {
    try {
      //Get token from header
      token = req.headers["x-auth-token"];
      //verfiy token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Get user from token

      req.result = await getUserById(decoded.id);

      if (!req.result) {
        throw new Error("Not authorized, no token");
      }
      // else if (req.result && req.result.user_has_profile_pic) {
      //   req.result.user_has_profile_pic.file_data = `data:${
      //     req.result.user_has_profile_pic.file_mimetype
      //   };base64,${req.result.user_has_profile_pic.file_data.toString(
      //     "base64"
      //   )}`;
      // }
      next();
    } catch (err) {
      res.status(401);
      throw new Error(err);
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// Send mesage to db
const getUserById = (userId) => {
  return Users.findOne({
    where: {
      [Op.and]: [{ id: userId }],
    },
    attributes: { exclude: ["password"] },
    // include: [
    //   {
    //     model: UserPictures,
    //     as: "user_has_profile_pic",
    //     attributes: {
    //       exclude: ["user_id", "id"],
    //     },
    //   },
    // ],
  })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = {
  protect,
};
