const axios = require("axios");

let cache = {};

async function getExchangeRates(baseCurrency = "USD") {
  const now = Date.now();
  if (
    cache[baseCurrency] &&
    now - cache[baseCurrency].fetchedAt < 60 * 60 * 1000
  ) {
    return cache[baseCurrency].rates;
  }

  if (!process.env.EXCHANGE_RATE_API_KEY || process.env.EXCHANGE_RATE_API_KEY === "your_api_key") {
    // Return standard mock rates for offline / dev usage
    const mockRates = {
      "USD": 1.0,
      "EUR": 0.92,
      "INR": 83.5,
      "GBP": 0.79,
      "JPY": 156.0,
      "CAD": 1.36,
      "AUD": 1.51
    };
    // Adjust mockRates based on baseCurrency
    const baseRate = mockRates[baseCurrency] || 1.0;
    const adjustedRates = {};
    for (const [curr, rate] of Object.entries(mockRates)) {
      adjustedRates[curr] = rate / baseRate;
    }
    return adjustedRates;
  }

  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
    );

    cache[baseCurrency] = { rates: res.data.conversion_rates, fetchedAt: now };
    return cache[baseCurrency].rates;
  } catch (err) {
    console.error("Exchange rate fetch failed, using fallback:", err.message);
    const mockRates = {
      "USD": 1.0,
      "EUR": 0.92,
      "INR": 83.5,
      "GBP": 0.79,
      "JPY": 156.0,
      "CAD": 1.36,
      "AUD": 1.51
    };
    const baseRate = mockRates[baseCurrency] || 1.0;
    const adjustedRates = {};
    for (const [curr, rate] of Object.entries(mockRates)) {
      adjustedRates[curr] = rate / baseRate;
    }
    return adjustedRates;
  }
}

module.exports = { getExchangeRates };
