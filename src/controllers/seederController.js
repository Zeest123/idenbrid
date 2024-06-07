const express = require("express");

const asyncHandler = require("express-async-handler");

const { Users } = require("../models/users");

const userData = [
  {
    full_name: "Super1",
    email: "admin@admin.com",
    password: "$2a$10$KdPPIi0pHoY.kBSN9e1tF.V0ZIRsrSzKpt.0ZIppSgTVXEI7Lgtq6", //Secret123
    is_admin: true,
  },
];

// @desc Store data in database
// @route GET /api/Seeder
// @access Public
const saveSeeder = asyncHandler(async (req, res) => {
  try {
    // create admin
    const user = await Users.bulkCreate(userData);
    if (!user) {
      res.status(400);
      throw new Error("User could not be created.");
    }
    return res.status(200).json({ message: "successfully added" });
  } catch (error) {
    res.status(res.statusCode ? res.statusCode : 500);
    console.log("Something went wrong during seeding data: ", error);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during seeding data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = { saveSeeder };
