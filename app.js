const path = require("path");
const express = require("express");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const tourRoute = require("./routes/tourRoutes");
const userRoute = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const viewRoute = require("./routes/viewRoute");
const bookingRoute = require("./routes/bookingRoute");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

// Start Expresss app
const app = express();

app.set("view engine", "ejs");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// SETTING HTTP HEADERS
app.use(helmet());

// PARSING DATA from body INTO req.body
app.use(express.json());
app.use(cookieParser());

// Data sanitization against nosql query injection

app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xss());

// LIMITING NUMBER OF REQUESTS FROM SINGLE IP
const limiter = rateLimiter({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many request from same IP. Please try in an hour."
});
app.use("/api", limiter);

// ROUTES

app.use("/", viewRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`the path ${req.originalUrl} not found.`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
