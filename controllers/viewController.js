const Tour = require("./../models/tourModel");
const Booking = require("./../models/bookingModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render("overview.pug", {
    title: "All tours",
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    select: "review rating user"
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  res.status(200).render("tour.pug", {
    title: "Tour",
    tour
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("login.pug", {
    title: "Login"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account.pug", {
    title: "Your account"
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render("signup.pug", {
    title: "Signup"
  });
};

exports.getForgotPassword = (req, res) => {
  res.status(200).render("forgotPassword.pug", {
    title: "Forgot Password"
  });
};

exports.getResetPassword = (req, res) => {
  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${req.params.token}`;

  res.links({
    next: resetLink
  });
  res.status(200).render("resetPassword.pug", {
    title: "Reset Password"
  });
};

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const toursId = bookings.map(el => el.tour);

  const tours = await Tour.find({ _id: { $in: toursId } });

  res.status(200).render("overview.pug", {
    title: "My Tours",
    tours
  });
});

exports.getManageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-photo");

  res.status(200).render("manageUsers.pug", {
    title: "Manage Users",
    users
  });
});

exports.getEditUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const roles = ["admin", "user", "guide", "lead-guide"];

  res.status(200).render("editUser.pug", {
    title: "Edit User",
    userUpdate: user,
    roles
  });
});

exports.getManageTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("manageTours.pug", {
    title: "Manage Tours",
    tours
  });
});

exports.getManageBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate({
      path: "user",
      select: "name"
    })
    .populate({
      path: "tour",
      select: "name"
    });
  res.status(200).render("manageBookings.pug", {
    title: "Manage Bookings",
    bookings
  });
});

exports.getEditTour = catchAsync(async (req, res, next) => {
  res.status(200).render("editTour.pug", {
    title: "Update Tour"
  });
});

exports.getRegisterTour = (req, res) => {
  res.status(200).render("editTour.pug", {
    title: "Add Tour"
  });
};

exports.getEditBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate({
      path: "user",
      select: "name"
    })
    .populate({
      path: "tour",
      select: "name"
    });
  res.status(200).render("editBooking.pug", {
    title: "Edit Booking",
    booking
  });
});

exports.getManageReviews = catchAsync(async (req,res,next)=>{

  const reviews = await Review.find();
  res.status(200).render("manageReviews.pug",{
    title:"Manage Reviews",
    reviews
  })
});