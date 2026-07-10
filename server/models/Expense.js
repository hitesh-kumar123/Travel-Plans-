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
    required: [true, "Amount is required"],
    min: [0, "Amount cannot be negative"],
  },
  currency: {
    type: String,
    default: "USD",
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{3}$/, "Currency must be a valid 3-letter ISO code"],
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
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
