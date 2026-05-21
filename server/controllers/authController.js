const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const {
  getOtpEmailTemplate,
  getPasswordResetTemplate,
} = require("../utils/emailTemplates");

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
      console.error("Failed to send registration email:", emailErr);
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
          console.error(
            "Failed to send verification email on login:",
            emailErr,
          );
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

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
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
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ msg: "There is no user with that email" });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    // Assumes frontend is running on localhost:3000 during dev or the deployed URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Only print to console during local development for easy testing
    if (process.env.NODE_ENV === "development") {
      console.log("\n=======================================================");
      console.log("🚀 DEV MODE: PASSWORD RESET LINK GENERATED");
      console.log(resetUrl);
      console.log("=======================================================\n");
    }

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      // We still try to send the email, but if it takes too long, they already have the link above!
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
        html: getPasswordResetTemplate(user.name, resetUrl),
      });

      res.status(200).json({ success: true, data: "Email sent successfully" });
    } catch (err) {
      console.error("Email sending failed:", err);

      // Reset the token fields since the email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      // Return a proper 500 error in production
      return res
        .status(500)
        .json({ msg: "Email could not be sent. Please try again later." });
    }
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Create JWT token and log user in automatically (optional)
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: "Password reset successful",
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ msg: "Please provide email and verification code" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    if (user.isVerified) {
      const payload = { user: { id: user.id } };
      return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5d" },
        (err, token) => {
          if (err) throw err;
          res.json({
            msg: "Email is already verified",
            token,
            user: { id: user.id, name: user.name, email: user.email },
          });
        },
      );
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({
        msg: "Invalid verification code. Please check and try again.",
      });
    }

    // Check if OTP is expired
    if (new Date(user.otpExpire).getTime() < Date.now()) {
      return res.status(400).json({
        msg: "Verification code has expired. Please request a new one.",
      });
    }

    // Successful verification
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    user.otpResendAttempts = 0;
    user.otpLastResent = null;
    user.otpBlockedUntil = null;
    await user.save();

    // Create JWT token and log user in automatically
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: "Email verified successfully! 🎉",
          token,
          user: { id: user.id, name: user.name, email: user.email },
        });
      },
    );
  } catch (err) {
    next(err);
  }
};

// Resend OTP
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Please provide email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: "This email is already verified" });
    }

    const now = Date.now();

    // Check if locked out (24-hour block)
    if (
      user.otpBlockedUntil &&
      new Date(user.otpBlockedUntil).getTime() > now
    ) {
      const timeLeft = new Date(user.otpBlockedUntil).getTime() - now;
      const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
      return res.status(429).json({
        msg: `Too many resend attempts. You are blocked from requesting new codes. Please try again in ${hoursLeft} hours.`,
        blocked: true,
        blockedUntil: user.otpBlockedUntil,
      });
    }

    // Enforce cooldown (60 seconds)
    if (
      user.otpLastResent &&
      now - new Date(user.otpLastResent).getTime() < 60000
    ) {
      const timeLeftSeconds = Math.ceil(
        (60000 - (now - new Date(user.otpLastResent).getTime())) / 1000,
      );
      return res.status(400).json({
        msg: `Please wait ${timeLeftSeconds} seconds before requesting another code.`,
      });
    }

    // Check if they are about to exceed limits (limit is 5 attempts)
    if (user.otpResendAttempts >= 5) {
      const blockedTime = new Date(now + 24 * 60 * 60 * 1000);
      user.otpBlockedUntil = blockedTime;
      await user.save();

      return res.status(429).json({
        msg: "You have reached the maximum number of resend attempts (5). You are blocked from requesting new codes for 24 hours.",
        blocked: true,
        blockedUntil: blockedTime,
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to user
    user.otp = otp;
    user.otpExpire = new Date(now + 5 * 60 * 1000); // 5 minutes
    user.otpResendAttempts += 1;
    user.otpLastResent = new Date();
    await user.save();

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: "Verify Your Email - PackGo",
        message: `Your new 6-digit verification code is: ${otp}\n\nThis code will expire in 5 minutes.`,
        html: getOtpEmailTemplate(
          user.name,
          otp,
          "Your new one time verification code is:",
        ),
      });
    } catch (emailErr) {
      console.error("Failed to send new verification email:", emailErr);
    }

    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("\n=======================================================");
      console.log("🚀 DEV MODE: EMAIL VERIFICATION OTP GENERATED");
      console.log(`Email: ${user.email}`);
      console.log(`OTP Code: ${otp}`);
      console.log("=======================================================\n");
    }

    res.json({
      success: true,
      msg: "A new 6-digit verification code has been sent to your email.",
    });
  } catch (err) {
    next(err);
  }
};

// Get OTP Status (Time left, cooldown, lockout blocks)
exports.getOtpStatus = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Please provide email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    if (user.isVerified) {
      return res.json({ isVerified: true });
    }

    const now = Date.now();

    // 1. Calculate time left for current OTP expiration
    let timeLeft = 0;
    if (user.otp && user.otpExpire) {
      const expireTime = new Date(user.otpExpire).getTime();
      if (expireTime > now) {
        timeLeft = Math.ceil((expireTime - now) / 1000);
      }
    }

    // 2. Calculate remaining resend cooldown (60 seconds)
    let resendCooldown = 0;
    if (user.otpLastResent) {
      const lastResentTime = new Date(user.otpLastResent).getTime();
      if (now - lastResentTime < 60000) {
        resendCooldown = Math.ceil((60000 - (now - lastResentTime)) / 1000);
      }
    }

    // 3. Calculate lockout details
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
      isVerified: false,
      timeLeft,
      resendCooldown,
      isBlocked,
      blockedUntil: user.otpBlockedUntil,
      hoursLeft,
    });
  } catch (err) {
    next(err);
  }
};

// Request Email Change OTP
exports.requestEmailChange = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
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
        "Failed to send email change verification email:",
        emailErr,
      );
    }

    if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
      console.log("\n=======================================================");
      console.log("🚀 DEV MODE: EMAIL CHANGE OTP GENERATED");
      console.log(`New Email: ${email}`);
      console.log(`OTP Code: ${otp}`);
      console.log("=======================================================\n");
    }

    res.json({
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
};
