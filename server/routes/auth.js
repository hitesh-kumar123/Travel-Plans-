const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");
const { authLimiter, otpLimiter } = require("../middleware/rateLimit");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/google", authLimiter, authController.googleAuth);

router.post("/register", authLimiter, requireDb, authController.register);

router.post("/login", authLimiter, requireDb, authController.login);

router.get("/profile", auth, authController.getProfile);

router.put("/profile", auth, authController.updateProfile);

router.post(
  "/forgot-password",
  authLimiter,
  requireDb,
  authController.forgotPassword,
);

router.put(
  "/reset-password/:token",
  authLimiter,
  requireDb,
  authController.resetPassword,
);
router.post(
  "/request-email-change",
  auth,
  otpLimiter,
  authController.requestEmailChange,
);

router.post(
  "/verify-email-change",
  auth,
  otpLimiter,
  authController.verifyEmailChange,
);
router.put(
  "/change-password",
  auth,
  authLimiter,
  authController.changePassword,
);

module.exports = router;
