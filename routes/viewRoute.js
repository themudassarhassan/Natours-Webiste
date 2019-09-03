const router = require("express").Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const bookingController = require("./../controllers/bookingController");

router.get(
  "/manage-reviews",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getManageReviews
);

router.get(
  "/edit-booking/:bookingId",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getEditBooking
);
router.get(
  "/register-tour",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getRegisterTour
);

router.get(
  "/edit-tour/:tourId",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getEditTour
);

router.get(
  "/edit-user/:userId",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getEditUser
);
router.get(
  "/manage-bookings",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getManageBookings
);
router.get(
  "/manage-tours",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getManageTours
);
router.get(
  "/manage-users",
  authController.protect,
  authController.restrictTo("admin"),
  viewController.getManageUsers
);

router.get("/me", authController.protect, viewController.getAccount);

router.get(
  "/my-bookings",
  authController.protect,
  viewController.getMyBookings
);

router.get(
  "/",
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

// middleware to check if user is logged in or not
router.use(authController.isLoggedIn);

router.get("/tour/:slug", viewController.getTour);

router.get("/login", viewController.getLogin);

router.get("/signup", viewController.getSignup);

router.get("/forgot-password", viewController.getForgotPassword);

router.get("/reset-password/:token", viewController.getResetPassword);

module.exports = router;
