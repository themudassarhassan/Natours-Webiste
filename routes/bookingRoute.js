const express = require("express");

const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/checkout-session/:tourId", bookingController.getCheckoutSession);

router.use(authController.restrictTo("admin", "lead-guide"));

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBooking);
router.delete("/:id", bookingController.deleteBooking);
router.put("/:id", bookingController.updateBooking);
module.exports = router;
