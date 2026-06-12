const translate = require("google-translate-api-x");
const SUPPORTED_LANGUAGES = [
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

const supportedLanguages = SUPPORTED_LANGUAGES.map((lang) => lang.code);
// @desc    Translate text
// @route   POST /api/translator/translate
// @access  Public
exports.translateText = async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    const sanitizedText = typeof text === "string" ? text.trim() : "";
    if (!sanitizedText || !targetLanguage) {
      return res.status(400).json({
        msg: "Text and target language are required",
      });
    }
    if (!supportedLanguages.includes(targetLanguage)) {
      return res.status(400).json({
        msg: "Invalid target language code",
      });
    }
    if (
      sourceLanguage &&
      sourceLanguage !== "auto" &&
      !supportedLanguages.includes(sourceLanguage)
    ) {
      return res.status(400).json({
        msg: "Invalid source language code",
      });
    }

    const MAX_TEXT_LENGTH = 5000;
    if (sanitizedText.length > MAX_TEXT_LENGTH) {
      return res.status(413).json({
        msg: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
      });
    }

    const options = { to: targetLanguage };
    if (sourceLanguage && sourceLanguage !== "auto") {
      options.from = sourceLanguage;
    }

    const result = await translate(sanitizedText, options);

    res.json({
      translatedText: result.text,
      detectedLanguage: result.from?.language?.iso || sourceLanguage || "auto",
      sourceLanguage: sourceLanguage || "auto",
      targetLanguage,
    });
  } catch (err) {
    console.error("Translation error:", err);

    if (err.code === "BAD_REQUEST") {
      return res.status(400).json({
        msg: "Invalid translation request",
      });
    }
    if (err.code === "ETIMEDOUT") {
      return res.status(504).json({
        msg: "Translation service timed out",
      });
    }
    return res.status(500).json({
      msg: "Translation failed due to server error",
    });
  }
};

// @desc    Get supported languages
// @route   GET /api/translator/languages
// @access  Public
exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = SUPPORTED_LANGUAGES;

    res.json(languages);
  } catch (err) {
    console.error("Languages error:", err.message);
    res.status(500).json({ msg: "Failed to get languages" });
  }
};
