const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user");
const CatchAsync = require("../utils/CatchAsync");
const CustomError = require("../utils/CustomError");
require("dotenv").config();

const authoriseUser = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new CustomError("you are not logged in. kindly login to have access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new CustomError("the user this token belong to does not exist", 401)
    );
  }

  req.user = currentUser;
  next();
});

module.exports = { authoriseUser };
