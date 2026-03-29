const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const mongoose = require("mongoose");

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { trip, amount, currency, category, description, date } = req.body;

    // Check if trip exists and belongs to user
    const tripExists = await Trip.findOne({
      _id: trip,
      user: req.user.id,
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }

    const newExpense = new Expense({
      user: req.user.id,
      trip,
      amount,
      currency,
      category,
      description,
      date: date || Date.now(),
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all expenses for a specific trip
exports.getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip exists and belongs to user
    const tripExists = await Trip.findOne({
      _id: tripId,
      user: req.user.id,
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }

    const expenses = await Expense.find({ trip: tripId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(500).send("Server error");
  }
};

// Get expense by ID
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server error");
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const { amount, currency, category, description, date } = req.body;

    // Build expense object
    const expenseFields = {};
    if (amount) expenseFields.amount = amount;
    if (currency) expenseFields.currency = currency;
    if (category) expenseFields.category = category;
    if (description) expenseFields.description = description;
    if (date) expenseFields.date = date;

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server error");
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Check if expense belongs to user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await expense.remove();
    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server error");
  }
};

// Get expense summary by category for a trip
exports.getExpenseSummary = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Check if trip exists and belongs to user
    const tripExists = await Trip.findOne({
      _id: tripId,
      user: req.user.id,
    });

    if (!tripExists) {
      return res.status(404).json({ msg: "Trip not found or unauthorized" });
    }

    const summary = await Expense.aggregate([
      { $match: { trip: mongoose.Types.ObjectId(tripId) } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(500).send("Server error");
  }
};
