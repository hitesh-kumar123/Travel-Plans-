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
  images: [{
    type: String
  }],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Trip", TripSchema);
