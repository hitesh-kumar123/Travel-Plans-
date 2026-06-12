const axios = require("axios");

let cache = {};

// Hardcoded exchange rates relative to 1 USD as a fallback
const USD_RATES = {
  INR: 83.5,
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 157.0,
  AED: 3.67,
  SGD: 1.35,
  AUD: 1.51,
};

function getFallbackRates(baseCurrency) {
  const baseToUSD = USD_RATES[baseCurrency] || 1;
  const rates = {};
  for (const [curr, usdRate] of Object.entries(USD_RATES)) {
    rates[curr] = Number((usdRate / baseToUSD).toFixed(6));
  }
  return rates;
}

async function getExchangeRates(baseCurrency = "USD") {
  const now = Date.now();
  if (
    cache[baseCurrency] &&
    now - cache[baseCurrency].fetchedAt < 60 * 60 * 1000
  ) {
    return {
      rates: cache[baseCurrency].rates,
      fetchedAt: cache[baseCurrency].fetchedAt,
    };
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey || apiKey.includes("your_exchange_rate_api_key")) {
    const rates = getFallbackRates(baseCurrency);
    cache[baseCurrency] = { rates, fetchedAt: now };
    return { rates, fetchedAt: now };
  }

  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`,
    );
    cache[baseCurrency] = {
      rates: res.data.conversion_rates,
      fetchedAt: now,
    };
    return {
      rates: res.data.conversion_rates,
      fetchedAt: now,
    };
  } catch (error) {
    console.warn(
      "Exchange rate API call failed, using fallback rates:",
      error.message,
    );
    const rates = getFallbackRates(baseCurrency);
    cache[baseCurrency] = { rates, fetchedAt: now };
    return { rates, fetchedAt: now };
  }
}

module.exports = { getExchangeRates };
