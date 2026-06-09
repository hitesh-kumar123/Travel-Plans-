const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    reviewText: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      minlength: [20, "Review must be at least 20 characters"],
      maxlength: [2000, "Review cannot exceed 2000 characters"],
    },
    travelDate: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    helpfulVotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

// Compound index: one review per user per destination
ReviewSchema.index({ user: 1, destination: 1 }, { unique: true });

// Index for efficient public queries (approved + destination)
ReviewSchema.index({ destination: 1, status: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Review", ReviewSchema);
