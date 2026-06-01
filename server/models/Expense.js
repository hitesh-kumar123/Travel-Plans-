const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be at least 0.01"],
  },
  currency: {
    type: String,
    default: "USD",
    trim: true,
    uppercase: true,
    minlength: [3, "Currency must be a 3-letter code"],
    maxlength: [3, "Currency must be a 3-letter code"],
    match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter code"],
  },
  category: {
    type: String,
    enum: [
      "Accommodation",
      "Transportation",
      "Food",
      "Activities",
      "Shopping",
      "Other",
    ],
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
