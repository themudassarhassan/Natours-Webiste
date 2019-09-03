const AppError = require("./../utils/AppError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value for ${value}. Please Enter different value.`;
  return new AppError(message, 400);
};

const handleJWTError = err => new AppError("Please login first.", 401);

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stackTrace: err.stack
    });
  }
  // Website Renderd
  res.status(err.statusCode).render("error.pug", {
    title: "error",
    msg: err.message
  });
};
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // if the error is known then send error message
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // if the error is unknow then send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
  // Website Renderd
  if (err.isOperational) {
    // if the error is known then send error message
    return res.status(err.statusCode).render("error.pug", {
      title: "error",
      msg: err.message
    });
  }
  // if the error is unknow then send generic message
  return res.status(err.statusCode).render("error.pug", {
    title: "error",
    msg: "Please try again later"
  });
};

// Global Error Handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV == "production") {
    let operationalError = { ...err };
    operationalError.message = err.message;
    if (err.name == "CastError") operationalError = handleCastErrorDB(err);

    if (err.code == 11000) operationalError = handleDuplicateErrorDB(err);

    if (err.name == "ValidationError")
      operationalError = handleValidationErrorDB(err);

    if (err.name == "JsonWebTokenError") operationalError = handleJWTError(err);

    sendErrorProd(operationalError, req, res);
  }
};
