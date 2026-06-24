const axios = require("axios");

let cache = {};

const fallbackRatesUSD = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 158.0,
  AED: 3.67,
  SGD: 1.35,
  AUD: 1.51,
};

async function getExchangeRates(baseCurrency = "USD") {
  const now = Date.now();
  if (
    cache[baseCurrency] &&
    now - cache[baseCurrency].fetchedAt < 60 * 60 * 1000
  ) {
    return cache[baseCurrency].rates;
  }

  try {
    if (!process.env.EXCHANGE_RATE_API_KEY) {
      throw new Error("EXCHANGE_RATE_API_KEY is not defined");
    }
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
    );
    cache[baseCurrency] = { rates: res.data.conversion_rates, fetchedAt: now };
    return cache[baseCurrency].rates;
  } catch (error) {
    console.warn(
      `Failed to fetch exchange rates for ${baseCurrency}: ${error.message}. Using fallback rates.`,
    );
    const baseToUSD = fallbackRatesUSD[baseCurrency] || 1;
    const derivedRates = {};
    for (const [currency, usdRate] of Object.entries(fallbackRatesUSD)) {
      derivedRates[currency] = usdRate / baseToUSD;
    }
    return derivedRates;
  }
}

module.exports = { getExchangeRates };
