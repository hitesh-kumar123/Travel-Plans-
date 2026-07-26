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
      match: [
        /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
      minlength: [8, "Password must be atleast 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "Password must include atleast 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      ],
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpire: {
      type: Date,
      default: null,
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

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.getEmailVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

const User = mongoose.model("User", UserSchema);

User.isBcryptHash = isBcryptHash;

module.exports = User;
