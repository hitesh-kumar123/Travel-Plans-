const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

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

module.exports = router;
