const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// @route   GET api/weather/current/:location
// @desc    Get current weather for a location
// @access  Public (no auth required)
router.get("/current/:location", weatherController.getCurrentWeather);

// @route   GET api/weather/forecast/:location
// @desc    Get 5-day forecast for a location
// @access  Public (no auth required)
router.get("/forecast/:location", weatherController.getForecast);

module.exports = router;
