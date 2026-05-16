const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", authController.register);

// @route   POST api/auth/register/request-otp
// @desc    Request OTP for registration
// @access  Public
router.post("/register/request-otp", authController.requestRegisterOtp);

// @route   POST api/auth/register/verify-otp
// @desc    Verify OTP for registration
// @access  Public
router.post("/register/verify-otp", authController.verifyRegisterOtp);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", authController.login);

// @route   POST api/auth/google
// @desc    Google auth
// @access  Public
router.post("/google", authController.googleAuth);

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

// @route   POST api/auth/change-password/request-otp
// @desc    Request OTP for password change
// @access  Private
router.post(
	"/change-password/request-otp",
	auth,
	authController.requestChangePasswordOtp,
);

// @route   PUT api/auth/change-password/verify-otp
// @desc    Verify OTP for password change
// @access  Private
router.put(
	"/change-password/verify-otp",
	auth,
	authController.verifyChangePasswordOtp,
);

// @route   POST api/auth/forgot-password/request-otp
// @desc    Request OTP for forgot password
// @access  Public
router.post(
	"/forgot-password/request-otp",
	authController.requestForgotPasswordOtp,
);

// @route   POST api/auth/forgot-password/verify-otp
// @desc    Verify OTP for forgot password
// @access  Public
router.post(
	"/forgot-password/verify-otp",
	authController.verifyForgotPasswordOtp,
);

module.exports = router;
