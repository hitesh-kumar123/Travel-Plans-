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
  },
  currency: {
    type: String,
    default: "USD",
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

ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ trip: 1, date: -1 });

module.exports = mongoose.model("Expense", ExpenseSchema);
