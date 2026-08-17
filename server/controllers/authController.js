const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  getPasswordResetTemplate,
  getOtpEmailTemplate,
} = require("../utils/emailTemplates");

// google signup
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user
// Register a new user & immediately issue JWT token for seamless instant login
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res
        .status(400)
        .json({ msg: "Please provide all required fields." });
    }

    if (!/^[A-Za-z\s]+$/.test(name.trim()) || name.trim().length < 2) {
      return res.status(400).json({
        msg: "Name must be at least 2 characters and contain only letters.",
      });
    }

    // RFC 5322 email pre-validation
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email.trim(),
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid email address." });
    }

    // Password complexity: min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim().replace(/\s+/g, " ");

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({
        msg: "An account with this email already exists. Please log in directly.",
      });
    }

    // Create user with verified status for friction-free access
    user = new User({
      name: normalizedName,
      email: normalizedEmail,
      password,
      isVerified: true,
      authProvider: "local",
    });

    await user.save();

    // Generate JWT token directly
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
      msg: "Account created successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ msg: "Please provide email and password." });
    }

    // RFC 5322 email validation
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email.trim(),
      )
    ) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    // Check password
    let isMatch;
    try {
      isMatch = await user.verifyPassword(password, { upgradeLegacy: true });
    } catch (err) {
      return next(err);
    }
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log("Received Token:", req.params.token);
    console.log("Hashed Token:", token);

    const allUsers = await User.find({}, "email emailVerificationToken");
    console.log(allUsers);
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Verification link is invalid or expired.",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.json({
      success: true,
      msg: "Email verified successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// google signup

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Credential is required!!" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        authProvider: "google",
        isVerified: true,
      });
    }

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      Sucess: false,
      Message: "Google Authentication failed",
    });
  }
};
// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email date isVerified",
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user profile (name only)
// Email changes must use the dedicated OTP flow: POST /request-email-change → POST /verify-email-change
exports.updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ msg: "Name must be at least 2 characters" });
    }

    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      return res
        .status(400)
        .json({ msg: "Name can only contain letters and spaces" });
    }

    const updateFields = {
      name: name.trim().replace(/\s+/g, " "),
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("name email date isVerified");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    let isMatch;
    try {
      isMatch = await user.verifyPassword(currentPassword);
    } catch (err) {
      return next(err);
    }
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (typeof email !== "string" || !email.trim()) {
      return res
        .status(400)
        .json({ msg: "Please enter a valid email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        msg: "Successfully sent a reset link, if a user with that email exists.",
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Determine frontend URL (from env or request origin or fallback to live deployed URL)
    const frontendUrl =
      process.env.FRONTEND_URL ||
      (req.headers.origin && req.headers.origin.startsWith("http")
        ? req.headers.origin
        : "https://travel-plans-phi.vercel.app");
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request - PackGo",
        message,
        html: getPasswordResetTemplate(user.name, resetUrl),
      });

      return res.status(200).json({
        success: true,
        msg: "Password reset link sent to your email successfully.",
      });
    } catch (err) {
      console.error("[forgotPassword] Email dispatch failed:", err.message);

      // Invalidate the token since email could not be delivered
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        msg: "Failed to send reset email. Please check your SMTP configuration or try again later.",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const rawToken = req.params.token;

    if (!rawToken || typeof rawToken !== "string") {
      return res.status(400).json({ msg: "Invalid or missing reset token." });
    }

    if (!password || typeof password !== "string") {
      return res.status(400).json({ msg: "Please provide a new password." });
    }

    // Password complexity check: min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
      });
    }

    // Get hashed token (trim token to handle copy-paste whitespace/newlines)
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken.trim())
      .digest("hex");

    const user = await User.findOne({ resetPasswordToken }).select("+password");

    if (
      !user ||
      !user.resetPasswordExpire ||
      new Date(user.resetPasswordExpire).getTime() < Date.now()
    ) {
      return res.status(400).json({
        msg: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Create JWT token and log user in automatically
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      msg: "Password reset successful! You can now log in.",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// Request Email Change OTP
exports.requestEmailChange = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email) {
      return res
        .status(400)
        .json({ msg: "Please provide the new email address." });
    }

    // Check if same as current email
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (currentUser.email.toLowerCase() === email.toLowerCase()) {
      return res
        .status(400)
        .json({ msg: "This is already your current email address." });
    }

    // Check if new email is taken by another account
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Email is already taken by another account." });
    }

    const now = Date.now();

    // Check 24-hour lockout
    if (
      currentUser.otpBlockedUntil &&
      new Date(currentUser.otpBlockedUntil).getTime() > now
    ) {
      const timeLeft = new Date(currentUser.otpBlockedUntil).getTime() - now;
      const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
      return res.status(429).json({
        msg: `Too many attempts. You are blocked from requesting codes. Please try again in ${hoursLeft} hours.`,
        blocked: true,
        blockedUntil: currentUser.otpBlockedUntil,
      });
    }

    // Check 60s cooldown
    if (currentUser.otpLastResent) {
      const lastResentTime = new Date(currentUser.otpLastResent).getTime();
      if (now - lastResentTime < 60000) {
        const cooldownLeft = Math.ceil((60000 - (now - lastResentTime)) / 1000);
        return res.status(429).json({
          msg: `Please wait ${cooldownLeft} seconds before requesting a new code.`,
          cooldownLeft,
        });
      }
    }

    // Increment attempts
    const newAttempts = currentUser.otpResendAttempts + 1;
    if (newAttempts > 5) {
      const blockedTime = new Date(now + 24 * 60 * 60 * 1000);
      currentUser.otpBlockedUntil = blockedTime;
      await currentUser.save();

      return res.status(429).json({
        msg: "You have reached the maximum number of attempts (5). You are blocked from requesting new codes for 24 hours.",
        blocked: true,
        blockedUntil: blockedTime,
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    currentUser.otp = otp;
    currentUser.otpExpire = new Date(now + 5 * 60 * 1000); // 5 minutes
    currentUser.otpResendAttempts = newAttempts;
    currentUser.otpLastResent = new Date();
    currentUser.tempEmail = email;
    await currentUser.save();

    // Send Email
    try {
      await sendEmail({
        email,
        subject: "Verify Your New Email - PackGo",
        message: `Your 6-digit verification code to update your email to ${email} is: ${otp}\n\nThis code will expire in 5 minutes.`,
        html: getOtpEmailTemplate(
          currentUser.name,
          otp,
          `Your 6-digit verification code to update your email to <strong>${email}</strong> is:`,
        ),
      });
    } catch (emailErr) {
      console.error(
        "[authController] Email change OTP dispatch failed:",
        emailErr.message,
      );
      return res.status(500).json({
        msg: "Failed to send email verification code. Please try again later.",
      });
    }

    return res.json({
      success: true,
      msg: "A verification code has been sent to your new email address.",
    });
  } catch (err) {
    next(err);
  }
};

// Verify Email Change OTP
exports.verifyEmailChange = async (req, res, next) => {
  try {
    const { otpCode, discard } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (discard) {
      user.tempEmail = null;
      user.otp = null;
      user.otpExpire = null;
      user.otpResendAttempts = 0;
      user.otpLastResent = null;
      user.otpBlockedUntil = null;
      await user.save();
      return res.json({
        success: true,
        msg: "Email change request discarded successfully.",
      });
    }

    if (!otpCode) {
      return res
        .status(400)
        .json({ msg: "Please enter the verification code." });
    }

    if (!user.tempEmail) {
      return res
        .status(400)
        .json({ msg: "No active email change request found." });
    }

    // Check expiration
    const now = Date.now();
    if (
      !user.otp ||
      !user.otpExpire ||
      new Date(user.otpExpire).getTime() < now
    ) {
      return res.status(400).json({
        msg: "Verification code has expired. Please request a new one.",
      });
    }

    // Check value
    if (user.otp !== otpCode) {
      return res
        .status(400)
        .json({ msg: "Invalid verification code. Please try again." });
    }

    // Success! Update email
    user.email = user.tempEmail;
    user.tempEmail = null;
    user.otp = null;
    user.otpExpire = null;
    user.otpResendAttempts = 0;
    user.otpLastResent = null;
    user.otpBlockedUntil = null;
    await user.save();

    res.json({
      success: true,
      msg: "Email updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get Email Change Status
exports.getEmailChangeStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const now = Date.now();
    let timeLeft = 0;
    if (user.otp && user.otpExpire) {
      const expireTime = new Date(user.otpExpire).getTime();
      if (expireTime > now) timeLeft = Math.ceil((expireTime - now) / 1000);
    }

    let resendCooldown = 0;
    if (user.otpLastResent) {
      const lastResentTime = new Date(user.otpLastResent).getTime();
      if (now - lastResentTime < 60000)
        resendCooldown = Math.ceil((60000 - (now - lastResentTime)) / 1000);
    }

    let isBlocked = false;
    let hoursLeft = 0;
    if (user.otpBlockedUntil) {
      const blockEnd = new Date(user.otpBlockedUntil).getTime();
      if (blockEnd > now) {
        isBlocked = true;
        hoursLeft = Math.ceil((blockEnd - now) / (1000 * 60 * 60));
      }
    }

    res.json({
      tempEmail: user.tempEmail,
      timeLeft,
      resendCooldown,
      isBlocked,
      blockedUntil: user.otpBlockedUntil,
      hoursLeft,
    });
  } catch (err) {
    next(err);
  }

  console.log(typeof exports.verifyEmail);
};
