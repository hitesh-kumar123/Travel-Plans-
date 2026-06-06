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
  },
  budget: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["planned", "ongoing", "completed"],
    default: "planned",
  },
  activities: [
    {
      name: String,
      date: Date,
      location: String,
      notes: String,
    },
  ],
  accommodation: {
    name: String,
    bookingRef: String,
    checkIn: Date,
    checkOut: Date,
    address: String,
    contactInfo: String,
  },
  transportation: {
    type: String,
    bookingRef: String,
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
