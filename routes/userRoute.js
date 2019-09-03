const express = require("express");

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.put("/resetPassword/:token", authController.resetPassword);

// Middleware to grant access to onyl logged in users
router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser);

router.put("/updatePassword", authController.updatePassword);

router.put(
  "/updateMe",
  userController.uploadUserImage,
  userController.resizeUserImage,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// Middleware to grant access to only admin
router.use(authController.restrictTo("admin"));

router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .put(userController.updateUser);

module.exports = router;
