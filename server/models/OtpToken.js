const mongoose = require("mongoose");

const OtpTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ["register", "password_reset", "change_password"],
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

OtpTokenSchema.index({ email: 1, purpose: 1, createdAt: -1 });

module.exports = mongoose.model("OtpToken", OtpTokenSchema);
