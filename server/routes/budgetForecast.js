const express = require("express");
const router = express.Router();
const {
  getBudgetForecast,
} = require("../controllers/budgetForecastController");
const auth = require("../middleware/auth");

router.get("/:tripId", auth, getBudgetForecast);

module.exports = router;
