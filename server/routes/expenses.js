const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../middleware/auth");

// @route   GET api/expenses
// @desc    Get all user expenses (all trips) - for analytics
// @access  Private
router.get("/", auth, expenseController.getAllUserExpenses);

// @route   POST api/expenses
// @desc    Create a new expense
// @access  Private
router.post("/", auth, expenseController.createExpense);

// @route   GET api/expenses/trip/:tripId
// @desc    Get all expenses for a trip
// @access  Private
router.get("/trip/:tripId", auth, expenseController.getTripExpenses);

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get("/:id", auth, expenseController.getExpense);

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put("/:id", auth, expenseController.updateExpense);

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete("/:id", auth, expenseController.deleteExpense);

// @route   GET api/expenses/summary/:tripId
// @desc    Get expense summary by category for a trip
// @access  Private
router.get("/summary/:tripId", auth, expenseController.getExpenseSummary);

module.exports = router;
