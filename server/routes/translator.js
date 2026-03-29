const express = require("express");
const router = express.Router();
const translatorController = require("../controllers/translatorController");
const auth = require("../middleware/auth");

// @route   POST api/translator/translate
// @desc    Translate text
// @access  Private
router.post("/translate", auth, translatorController.translateText);

// @route   GET api/translator/languages
// @desc    Get supported languages
// @access  Private
router.get("/languages", auth, translatorController.getSupportedLanguages);

module.exports = router;
