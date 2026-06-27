const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Destination cannot exceed 200 characters"],
  },
  images: [
    {
      type: String,
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  budget: {
    type: Number,
    default: 0,
    min: [0, "Budget cannot be negative"],
  },
  status: {
    type: String,
    enum: ["planned", "ongoing", "completed"],
    default: "planned",
  },
  activities: [
    {
      name: { type: String, trim: true, maxlength: 200 },
      date: Date,
      location: { type: String, trim: true, maxlength: 200 },
      notes: { type: String, trim: true, maxlength: 1000 },
    },
  ],
  accommodation: {
    name: { type: String, trim: true, maxlength: 200 },
    bookingRef: { type: String, trim: true, maxlength: 100 },
    checkIn: Date,
    checkOut: Date,
    address: { type: String, trim: true, maxlength: 500 },
    contactInfo: { type: String, trim: true, maxlength: 200 },
  },
  transportation: {
    type: { type: String, trim: true, maxlength: 100 },
    bookingRef: { type: String, trim: true, maxlength: 100 },
    departureTime: Date,
    arrivalTime: Date,
  },
  shareToken: {
    type: String,
    default: null,
  },

  shareEnabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Enforce chronological date ordering constraints
TripSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "End date must be on or after the start date.");
  }

  if (
    this.accommodation &&
    this.accommodation.checkIn &&
    this.accommodation.checkOut &&
    this.accommodation.checkOut < this.accommodation.checkIn
  ) {
    this.invalidate(
      "accommodation.checkOut",
      "Accommodation check-out date must be on or after the check-in date.",
    );
  }

  if (
    this.transportation &&
    this.transportation.departureTime &&
    this.transportation.arrivalTime &&
    this.transportation.arrivalTime < this.transportation.departureTime
  ) {
    this.invalidate(
      "transportation.arrivalTime",
      "Transportation arrival time must be on or after the departure time.",
    );
  }

  next();
});

module.exports = mongoose.model("Trip", TripSchema);
