const CustomError = require("../utils/CustomError");

const handleCastErrorDb = (err) => {
  message = `Invalid ${err.path}:${err.value}.`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldDb = (err) => {
  value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  message = `Duplicate field value: ${value}. please use another value`;
  return new CustomError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new CustomError(message, 422);
};
const handleJwtError = () => {
  return new CustomError("Invalid Token. please login again", 401);
};

const handleExpiredTokenError = () => {
  return new CustomError("your token has expired. please login again", 401);
};

const sendErrorDev = (err, req, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);
    if (error.name === "CastError") error = handleCastErrorDb(error);
    if (error.code === 11000) error = handleDuplicateFieldDb(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDb(error);
    if (error.name === "JsonWebTokenError") error = handleJwtError();
    if (error.name === "TokenExpiredError") error = handleExpiredTokenError();
    sendErrorProd(error, req, res);
  }
};
