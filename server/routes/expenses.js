const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const auth = require("../middleware/auth");
const { expenseValidation } = require("../middleware/validators");

// @route   GET api/expenses
// @desc    Get all user expenses (all trips) - for analytics
// @access  Private
router.get("/", auth, expenseController.getAllUserExpenses);

// @route   POST api/expenses
// @desc    Create a new expense
// @access  Private
router.post(
  "/",
  auth,
  expenseValidation.createExpense,
  expenseController.createExpense,
);

// @route   GET api/expenses/trip/:tripId
// @desc    Get all expenses for a trip
// @access  Private
router.get(
  "/trip/:tripId",
  auth,
  expenseValidation.tripIdParam,
  expenseController.getTripExpenses,
);

// @route   GET api/expenses/summary/:tripId
// @desc    Get expense summary by category for a trip
// @access  Private
// NOTE: Must be defined BEFORE /:id to avoid Express matching "summary" as an :id param.
router.get(
  "/summary/:tripId",
  auth,
  expenseValidation.tripIdParam,
  expenseController.getExpenseSummary,
);

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get(
  "/:id",
  auth,
  expenseValidation.expenseIdParam,
  expenseController.getExpense,
);

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put(
  "/:id",
  auth,
  expenseValidation.updateExpense,
  expenseController.updateExpense,
);

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete(
  "/:id",
  auth,
  expenseValidation.expenseIdParam,
  expenseController.deleteExpense,
);

module.exports = router;
