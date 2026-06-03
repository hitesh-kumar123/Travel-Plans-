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

  const res = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`,
  );

  cache[baseCurrency] = { rates: res.data.conversion_rates, fetchedAt: now };
  return cache[baseCurrency].rates;
}

module.exports = { getExchangeRates };
