const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { getOtpEmailTemplate } = require("../utils/emailTemplates");
const {
  buildEmailFailureMessage,
  logEmailFailure,
} = require("../utils/otpHelpers");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }

    if (!/^[A-Za-z\s]+$/.test(name) || name.trim().length < 2) {
      return res.status(400).json({
        msg: "Name must be at least 2 characters and contain only letters",
      });
    }

    // RFC 5322 email pre-validation: reject leading dots and malformed structures before DB queries
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    // Enforce strong password complexity rules at the controller level (atleast 8 characters and atleast contain 1 uppercase, 1 lowercase, 1 number, and 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters and atleast contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create new user with normalized single-spaced name and OTP verification fields
    user = new User({
      name: name.trim().replace(/\s+/g, " "),
      email,
      password,
      isVerified: false,
      otp,
      otpExpire,
      otpResendAttempts: 1, // Count the initial registration OTP send as attempt #1
      otpLastResent: new Date(),
    });

    await user.save();

    // Send email with OTP code
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your Email - PackGo",
        message: `Welcome to PackGo! Your 6-digit verification code is: ${otp}\n\nThis code will expire in 5 minutes.`,
        html: getOtpEmailTemplate(
          user.name,
          otp,
          "Welcome to PackGo! Your one time verification code is:",
        ),
      });
    } catch (emailErr) {
      logEmailFailure("registration", emailErr, "authController");
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        msg: buildEmailFailureMessage("registration"),
      });
    }

    // Dev mode log
    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("\n=======================================================");
      console.log("🚀 DEV MODE: EMAIL VERIFICATION OTP GENERATED");
      console.log(`Email: ${user.email}`);
      console.log(`OTP Code: ${otp}`);
      console.log("=======================================================\n");
    }

    res.status(201).json({
      success: true,
      email: user.email,
      msg: "Account created! A 6-digit verification code has been sent to your email.",
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // RFC 5322 email pre-validation for login attempts
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      return res.status(400).json({ msg: "Please enter a valid email" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Prevent login if not verified
    if (!user.isVerified) {
      const now = Date.now();

      // Check if blocked (24-hour lockout)
      if (
        user.otpBlockedUntil &&
        new Date(user.otpBlockedUntil).getTime() > now
      ) {
        const timeLeft = new Date(user.otpBlockedUntil).getTime() - now;
        const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
        return res.status(401).json({
          msg: `Please verify your email before logging in. You have reached the maximum number of resend attempts and are blocked from requesting new codes. Please try again in ${hoursLeft} hours.`,
          unverified: true,
          email: user.email,
          blocked: true,
          blockedUntil: user.otpBlockedUntil,
        });
      }

      // Generate a new OTP if current is missing or expired
      if (!user.otp || new Date(user.otpExpire).getTime() < now) {
        const newAttempts = user.otpResendAttempts + 1;

        // If triggering a new login OTP exceeds the limit, block them
        if (newAttempts > 5) {
          const blockedTime = new Date(now + 24 * 60 * 60 * 1000);
          user.otpBlockedUntil = blockedTime;
          await user.save();

          return res.status(401).json({
            msg: "Please verify your email before logging in. You have reached the maximum number of resend attempts and are blocked from requesting new codes. Please try again in 24 hours.",
            unverified: true,
            email: user.email,
            blocked: true,
            blockedUntil: blockedTime,
          });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = new Date(now + 5 * 60 * 1000);
        user.otpLastResent = new Date();
        user.otpResendAttempts = newAttempts; // Persist the incremented attempt count
        await user.save();

        try {
          await sendEmail({
            email: user.email,
            subject: "Verify Your Email - PackGo",
            message: `Your 6-digit verification code is: ${otp}\n\nThis code will expire in 5 minutes.`,
            html: getOtpEmailTemplate(
              user.name,
              otp,
              "Your one time verification code is:",
            ),
          });
        } catch (emailErr) {
          logEmailFailure("login OTP resend", emailErr, "authController");
          return res.status(500).json({
            msg: buildEmailFailureMessage("login OTP resend"),
          });
        }

        if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
          console.log(
            "\n=======================================================",
          );
          console.log("🚀 DEV MODE: EMAIL VERIFICATION OTP GENERATED");
          console.log(`Email: ${user.email}`);
          console.log(`OTP Code: ${otp}`);
          console.log(
            "=======================================================\n",
          );
        }

        return res.status(401).json({
          msg: "Please verify your email before logging in. A new 6-digit code has been sent to your email.",
          unverified: true,
          email: user.email,
        });
      }

      // Current OTP is still valid, redirect user without sending a new email
      return res.status(401).json({
        msg: "Please verify your email before logging in. Use the verification code previously sent to your email.",
        unverified: true,
        email: user.email,
      });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};
