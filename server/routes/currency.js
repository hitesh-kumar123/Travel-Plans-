const express = require("express");
const router = express.Router();
const { getExchangeRates } = require("../utils/currencyConverter");
const auth = require("../middleware/auth");
const { currencyValidation } = require("../middleware/validators");

router.get("/rates", auth, currencyValidation.rates, async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const rates = await getExchangeRates(base);
    res.json({ base, rates });
  } catch (_err) {
    res.status(500).json({ msg: "Failed to fetch exchange rates" });
  }
});

module.exports = router;
