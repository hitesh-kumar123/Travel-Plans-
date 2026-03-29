const axios = require("axios");

// Translate text
exports.translateText = async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res
        .status(400)
        .json({ msg: "Please provide text and target language" });
    }

    // Using an example translation API (Replace with your preferred API)
    // This is using LibreTranslate API as an example
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: sourceLanguage || "auto",
      target: targetLanguage,
      format: "text",
    });

    res.json({
      originalText: text,
      translatedText: response.data.translatedText,
      sourceLanguage:
        response.data.detectedLanguage?.language || sourceLanguage,
      targetLanguage,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get supported languages
exports.getSupportedLanguages = async (req, res) => {
  try {
    // Using an example translation API (Replace with your preferred API)
    const response = await axios.get("https://libretranslate.de/languages");

    const languages = response.data.map((lang) => ({
      code: lang.code,
      name: lang.name,
    }));

    res.json(languages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
