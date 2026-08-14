const express = require("express");
const router = express.Router();
const translatorController = require("../controllers/translatorController");
const auth = require("../middleware/auth");
const { externalApiLimiter } = require("../middleware/rateLimit");

router.post(
  "/translate",
  auth,
  externalApiLimiter,
  translatorController.translateText,
);

router.get(
  "/languages",
  auth,
  externalApiLimiter,
  translatorController.getSupportedLanguages,
);

module.exports = router;
