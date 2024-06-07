const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

//to generate selling partner api

const customException = (message, statusCode) => {
  console.log("message::", message);
  const error = new Error(message);

  error.statusCode = statusCode;
  return error;
};

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${msg}`;
};

const expressValidatorError = (req) => {
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    console.log(result.array()[0]);
    throw new Error(result.array());
  }
};

// generate token after login
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "120h",
    }
  );
};

module.exports = {
  customException,
  expressValidatorError,
  generateToken,
};
