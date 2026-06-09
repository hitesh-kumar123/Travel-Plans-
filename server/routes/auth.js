const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const requireDb = require("../middleware/requireDb");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", requireDb, authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", requireDb, authController.login);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, authController.getProfile);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, authController.updateProfile);

// @route   PUT api/auth/change-password
// @desc    Change password
// @access  Private
router.put("/change-password", auth, authController.changePassword);

// @route   POST api/auth/request-email-change
// @desc    Request email change OTP
// @access  Private
router.post("/request-email-change", auth, authController.requestEmailChange);

// @route   POST api/auth/verify-email-change
// @desc    Verify email change OTP
// @access  Private
router.post("/verify-email-change", auth, authController.verifyEmailChange);

// @route   GET api/auth/email-change-status
// @desc    Get real-time OTP status for active email change
// @access  Private
router.get("/email-change-status", auth, authController.getEmailChangeStatus);

// @route   POST api/auth/forgot-password
// @desc    Forgot password (send email)
// @access  Public
router.post("/forgot-password", requireDb, authController.forgotPassword);

// @route   PUT api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put("/reset-password/:token", requireDb, authController.resetPassword);

module.exports = router;
