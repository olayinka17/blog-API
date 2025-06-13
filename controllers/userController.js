const User = require("../models/user");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const CatchAsync = require("../utils/CatchAsync");
require("dotenv").config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCreatedToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const signup = CatchAsync(async (req, res, next) => {
  const newUser = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    confirmedPassword: req.body.confirmedPassword,
  });
  sendCreatedToken(newUser, 201, res);
});

const login = CatchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new CustomError("please provide email and password", 401));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("Incorrect email or password", 401));
  }
  const isMatch = await user.comparePassword(password, user.password);

  if (!isMatch) {
    return next(new CustomError("Incorrect email or password", 401));
  }
  sendCreatedToken(user, 200, res);
});
module.exports = {
  signup,
  login,
};
