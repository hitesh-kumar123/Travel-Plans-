const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// Get all expenses for a user (across all trips) - for analytics
exports.getAllUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate("trip", "destination startDate endDate")
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { trip, amount, currency, category, description, date } = req.body;

    // Validate amount: must be a positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ msg: "Amount must be a positive number greater than zero." });
    }

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
      amount: parsedAmount,
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
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { amount, currency, category, description, date } = req.body;

    // Validate amount if provided: must be a positive number
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res
          .status(400)
          .json({ msg: "Amount must be a positive number greater than zero." });
      }
    }

    // Build expense object
    const expenseFields = {};
    if (amount !== undefined) expenseFields.amount = parseFloat(amount);
    if (currency) expenseFields.currency = currency;
    if (category) expenseFields.category = category;
    if (description) expenseFields.description = description;
    if (date) expenseFields.date = date;

    expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: expenseFields },
      { new: true },
    );

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(403).json({ message: "Access denied" });
    }

    await expense.deleteOne();
    res.json({ msg: "Expense removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
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
      { $match: { trip: tripExists._id } },
      {
        $group: {
          _id: { category: "$category", currency: "$currency" },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          currency: "$_id.currency",
          totalAmount: 1,
          count: 1,
        },
      },
      { $sort: { category: 1, totalAmount: -1 } },
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
