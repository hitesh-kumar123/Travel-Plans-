export const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AED: "د.إ",
  SGD: "S$",
  AUD: "A$",
};

/**
 * Converts an amount from one currency to another using exchange rates with INR as pivot.
 * exchangeRates is a map where rate is relative to INR (i.e. 1 INR = X foreign currency).
 *
 * @param {number|string} amount - The amount to convert
 * @param {string} fromCurrency - ISO code of source currency
 * @param {string} toCurrency - ISO code of target currency
 * @param {Object} exchangeRates - Map of currency rates relative to INR
 * @returns {number} The converted numeric amount (or original if conversion fails)
 */
export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  exchangeRates,
) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return amount === undefined || amount === null ? 0 : Number(amount) || 0;
  }
  const numericAmount = Number(amount);

  const from = fromCurrency || "USD";
  const to = toCurrency || "INR";

  if (from === to) {
    return numericAmount;
  }

  if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
    return numericAmount;
  }

  try {
    let amountInINR;
    if (from === "INR") {
      amountInINR = numericAmount;
    } else {
      const rateToINR = exchangeRates[from];
      if (!rateToINR) return numericAmount;
      amountInINR = numericAmount / rateToINR;
    }

    if (to === "INR") {
      return amountInINR;
    }

    const rateToTarget = exchangeRates[to];
    if (!rateToTarget) return numericAmount;
    return amountInINR * rateToTarget;
  } catch (error) {
    return numericAmount;
  }
};

/**
 * Formats a currency amount to a string with symbol, rounded value, and ISO code.
 * Example: ₹24,530 INR or $300 USD
 *
 * @param {number|string} amount - The amount to format
 * @param {string} currency - The target currency ISO code
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  const targetCurrency = currency || "USD";
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `${symbol}0 ${targetCurrency}`;
  }

  try {
    const rounded = Math.round(Number(amount));
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(rounded);

    return `${symbol}${formatted} ${targetCurrency}`;
  } catch (e) {
    return `${symbol}${amount} ${targetCurrency}`;
  }
};
