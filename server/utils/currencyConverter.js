const axios = require("axios");

let cache = {};

const USD_RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 155.0,
  AED: 3.67,
  SGD: 1.35,
  AUD: 1.5,
};

function getStaticRates(baseCurrency) {
  const baseInUSD = USD_RATES[baseCurrency] || 1;
  const rates = {};
  Object.keys(USD_RATES).forEach((curr) => {
    rates[curr] = USD_RATES[curr] / baseInUSD;
  });
  return rates;
}

async function getExchangeRates(baseCurrency = "USD") {
  const now = Date.now();
  if (
    cache[baseCurrency] &&
    now - cache[baseCurrency].fetchedAt < 60 * 60 * 1000
  ) {
    return cache[baseCurrency].rates;
  }

  // Try the configured API key endpoint first
  if (process.env.EXCHANGE_RATE_API_KEY) {
    try {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
      );
      if (res.data && res.data.conversion_rates) {
        cache[baseCurrency] = {
          rates: res.data.conversion_rates,
          fetchedAt: now,
        };
        return cache[baseCurrency].rates;
      }
    } catch (err) {
      console.warn(
        "Primary exchange rate API failed, trying fallback: ",
        err.message,
      );
    }
  }

  // Try backup free public keyless endpoint 1
  try {
    const res = await axios.get(
      `https://open.er-api.com/v6/latest/${baseCurrency}`,
    );
    if (res.data && res.data.rates) {
      cache[baseCurrency] = { rates: res.data.rates, fetchedAt: now };
      return cache[baseCurrency].rates;
    }
  } catch (err) {
    console.warn("Backup keyless API 1 failed, trying backup 2: ", err.message);
  }

  // Try backup free public keyless endpoint 2
  try {
    const res = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
    );
    if (res.data && res.data.rates) {
      cache[baseCurrency] = { rates: res.data.rates, fetchedAt: now };
      return cache[baseCurrency].rates;
    }
  } catch (err) {
    console.warn(
      "Backup keyless API 2 failed, falling back to static offline rates: ",
      err.message,
    );
  }

  // Final fallback: local static rates
  const staticRates = getStaticRates(baseCurrency);
  cache[baseCurrency] = { rates: staticRates, fetchedAt: now };
  return staticRates;
}

module.exports = { getExchangeRates };
