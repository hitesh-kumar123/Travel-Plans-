const translate = require("google-translate-api-x");
const { sendError, sendServerError } = require("../utils/apiResponse");

// @desc    Translate text
// @route   POST /api/translator/translate
// @access  Public
exports.translateText = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return sendError(res, 400, "Text and target language are required");
    }

    const options = { to: targetLanguage };
    if (sourceLanguage && sourceLanguage !== "auto") {
      options.from = sourceLanguage;
    }

    const result = await translate(text, options);

    res.json({
      translatedText: result.text,
      detectedLanguage: result.from?.language?.iso || sourceLanguage || "auto",
      sourceLanguage: sourceLanguage || "auto",
      targetLanguage,
    });
  } catch (err) {
    console.error("Translation error:", err.message);
    return sendServerError(res, err, "Translation failed. Please try again.");
  }
};

// @desc    Get supported languages
// @route   GET /api/translator/languages
// @access  Public
exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = [
      { code: "auto", name: "Auto Detect" },
      { code: "en", name: "English" },
      { code: "hi", name: "Hindi" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh-CN", name: "Chinese (Simplified)" },
      { code: "ar", name: "Arabic" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "bn", name: "Bengali" },
      { code: "ta", name: "Tamil" },
      { code: "te", name: "Telugu" },
      { code: "mr", name: "Marathi" },
      { code: "gu", name: "Gujarati" },
      { code: "kn", name: "Kannada" },
      { code: "ml", name: "Malayalam" },
      { code: "pa", name: "Punjabi" },
      { code: "th", name: "Thai" },
      { code: "vi", name: "Vietnamese" },
      { code: "tr", name: "Turkish" },
      { code: "nl", name: "Dutch" },
      { code: "pl", name: "Polish" },
      { code: "sv", name: "Swedish" },
      { code: "uk", name: "Ukrainian" },
    ];

    res.json(languages);
  } catch (err) {
    console.error("Languages error:", err.message);
    return sendServerError(res, err, "Failed to get languages");
  }
};
