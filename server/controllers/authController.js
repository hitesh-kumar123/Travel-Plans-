const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const OtpToken = require("../models/OtpToken");
const { sendOtpEmail } = require("../services/emailService");

const OTP_TTL_MINUTES = parseInt(process.env.OTP_TTL_MINUTES || "10", 10);
const OTP_SECRET = process.env.OTP_SECRET || process.env.JWT_SECRET;
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const hashOtp = (code) =>
  crypto.createHmac("sha256", OTP_SECRET).update(code).digest("hex");

const generateOtpCode = () =>
  `${crypto.randomInt(100000, 1000000)}`.padStart(6, "0");

const createOtpToken = async ({ email, userId, purpose }) => {
  const code = generateOtpCode();
  await OtpToken.create({
    email,
    userId,
    purpose,
    codeHash: hashOtp(code),
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  });
  return code;
};

const verifyOtpToken = async ({ email, purpose, code }) => {
  const token = await OtpToken.findOne({
    email,
    purpose,
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!token) {
    return { ok: false, msg: "OTP is invalid or expired" };
  }

  const isMatch = token.codeHash === hashOtp(code);
  if (!isMatch) {
    return { ok: false, msg: "OTP is invalid or expired" };
  }

  token.consumedAt = new Date();
  await token.save();
  return { ok: true, token };
};

// Register a new user (OTP-based)
exports.register = async (req, res, next) => {
  return exports.requestRegisterOtp(req, res, next);
};

// Request OTP for registration
exports.requestRegisterOtp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }

    let user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (!user) {
      user = new User({
        name,
        email,
        password,
        authProvider: "local",
        isEmailVerified: false,
      });
    } else {
      user.name = name;
      user.password = password;
      user.authProvider = "local";
    }

    await user.save();

    const code = await createOtpToken({
      email,
      userId: user.id,
      purpose: "register",
    });

    await sendOtpEmail({
      to: email,
      name,
      purpose: "register",
      code,
      ttlMinutes: OTP_TTL_MINUTES,
    });

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

// Verify OTP for registration
exports.verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ msg: "Please provide email and OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const result = await verifyOtpToken({
      email,
      purpose: "register",
      code: otp,
    });
    if (!result.ok) {
      return res.status(400).json({ msg: result.msg });
    }

    user.isEmailVerified = true;
    await user.save();

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

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({ msg: "Use Google sign-in" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ msg: "Email not verified" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
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

// Google authentication
exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ msg: "Missing Google ID token" });
    }
    if (!googleClient) {
      return res.status(500).json({ msg: "Google auth is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || "Google User";
    const googleId = payload?.sub;

    if (!email) {
      return res.status(400).json({ msg: "Google account email missing" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(24).toString("hex");
      user = new User({
        name,
        email,
        password: randomPassword,
        authProvider: "google",
        googleId,
        isEmailVerified: true,
      });
      await user.save();
    } else {
      user.authProvider = "google";
      user.googleId = user.googleId || googleId;
      user.isEmailVerified = true;
      await user.save();
    }

    const jwtPayload = { user: { id: user.id } };
    jwt.sign(
      jwtPayload,
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

// Request OTP for forgot password
exports.requestForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: "Please provide email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }
    if (user.authProvider !== "local") {
      return res
        .status(400)
        .json({ msg: "Use Google sign-in for this account" });
    }

    const code = await createOtpToken({
      email,
      userId: user.id,
      purpose: "password_reset",
    });

    await sendOtpEmail({
      to: email,
      name: user.name,
      purpose: "password_reset",
      code,
      ttlMinutes: OTP_TTL_MINUTES,
    });

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

// Verify OTP for forgot password
exports.verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide email, OTP, and new password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const result = await verifyOtpToken({
      email,
      purpose: "password_reset",
      code: otp,
    });
    if (!result.ok) {
      return res.status(400).json({ msg: result.msg });
    }

    user.password = newPassword;
    user.isEmailVerified = true;
    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

// Request OTP for change password (authenticated)
exports.requestChangePasswordOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }
    if (user.authProvider !== "local") {
      return res
        .status(400)
        .json({ msg: "Use Google sign-in for this account" });
    }

    const code = await createOtpToken({
      email: user.email,
      userId: user.id,
      purpose: "change_password",
    });

    await sendOtpEmail({
      to: user.email,
      name: user.name,
      purpose: "change_password",
      code,
      ttlMinutes: OTP_TTL_MINUTES,
    });

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};

// Verify OTP for change password (authenticated)
exports.verifyChangePasswordOtp = async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body;
    if (!otp || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide OTP and new password" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Account not found" });
    }

    const result = await verifyOtpToken({
      email: user.email,
      purpose: "change_password",
      code: otp,
    });
    if (!result.ok) {
      return res.status(400).json({ msg: result.msg });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
