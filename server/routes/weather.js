const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
const auth = require("../middleware/auth");
const { externalApiLimiter } = require("../middleware/rateLimit");

router.get(
  "/current/:location",
  auth,
  externalApiLimiter,
  weatherController.getCurrentWeather,
);

router.get(
  "/forecast/:location",
  auth,
  externalApiLimiter,
  weatherController.getForecast,
);

module.exports = router;
