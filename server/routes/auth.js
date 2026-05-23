const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const passport = require("passport");

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", authController.login);

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
router.post("/forgot-password", authController.forgotPassword);

// @route   PUT api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put("/reset-password/:token", authController.resetPassword);

// @route   POST api/auth/verify-otp
// @desc    Verify email with OTP
// @access  Public
router.post("/verify-otp", authController.verifyOtp);

// @route   POST api/auth/resend-otp
// @desc    Resend email verification OTP
// @access  Public
router.post("/resend-otp", authController.resendOtp);

// @route   POST api/auth/otp-status
// @desc    Get remaining OTP expiration and cooldown times
// @access  Public
router.post("/otp-status", authController.getOtpStatus);

// ==============================
// Google OAuth
// ==============================

// Start OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Centralized error-safe redirect for OAuth failures
function redirectToLoginWithReason(res, reason) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  return res.redirect(
    `${frontendUrl}/login?oauth=${encodeURIComponent(reason)}`,
  );
}

// OAuth callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login" },
    (err, user) => {
      if (err) {
        return redirectToLoginWithReason(res, "google_oauth_error");
      }
      if (!user) {
        return redirectToLoginWithReason(res, "google_oauth_failed");
      }

      try {
        const jwt = require("jsonwebtoken");

        if (!process.env.JWT_SECRET) {
          return redirectToLoginWithReason(res, "jwt_secret_missing");
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "5d",
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res.redirect(`${frontendUrl}/dashboard?token=${token}`);
      } catch (e) {
        return redirectToLoginWithReason(res, "jwt_sign_failed");
      }
    },
  )(req, res, next);
});


module.exports = router;


