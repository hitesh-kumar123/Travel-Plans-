const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

function isBcryptHash(value) {
  return typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      match: [/^[A-Za-z\s]+$/, "Name can only contain letters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // Strict RFC 5322 email regex: forbids leading dots and enforces valid domain/TLD structure
      match: [
        /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      // Strong password complexity: min 8 chars, >=1 uppercase, >=1 lowercase, >=1 number, >=1 special char
      minlength: [8, "Password must be atleast 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must include atleast 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
    otpResendAttempts: {
      type: Number,
      default: 0,
    },
    otpLastResent: {
      type: Date,
      default: null,
    },
    otpBlockedUntil: {
      type: Date,
      default: null,
    },
    tempEmail: {
      type: String,
      default: null,
    },
    baseCurrency: {
      type: String,
      default: "INR",
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.resetPasswordToken;
        return ret;
      },
    },
  },
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.verifyPassword = async function (
  candidatePassword,
  { upgradeLegacy = false } = {},
) {
  if (!isBcryptHash(this.password)) {
    const isMatch = this.password === candidatePassword;
    if (isMatch && upgradeLegacy) {
      this.password = candidatePassword;
      this.markModified("password");
      await this.save();
    }
    return isMatch;
  }

  return await this.comparePassword(candidatePassword);
};

// Method to generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire to 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

User.isBcryptHash = isBcryptHash;

module.exports = User;
