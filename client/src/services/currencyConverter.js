
const API_BASE_URL = "https://api.frankfurter.dev/v2";

const rateCache = new Map();

const SUPPORTED_CURRENCIES = ["INR", "USD", "EUR", "GBP"];

/**
 * Get the latest available exchange rate from a currency to INR.
 * Frankfurter publishes reference rates, generally updated daily.
 */
export const getRateToINR = async (currency) => {
  const sourceCurrency = String(currency || "").toUpperCase();

  if (!SUPPORTED_CURRENCIES.includes(sourceCurrency)) {
    throw new Error(`Unsupported currency: ${sourceCurrency}`);
  }

  if (sourceCurrency === "INR") {
    return { rate: 1, date: null };
  }

  if (rateCache.has(sourceCurrency)) {
    return rateCache.get(sourceCurrency);
  }

  const response = await fetch(
    `${API_BASE_URL}/rate/${sourceCurrency}/INR`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch ${sourceCurrency} to INR exchange rate.`,
    );
  }

  const data = await response.json();

  if (
    !Number.isFinite(data.rate) ||
    data.rate <= 0 ||
    data.quote !== "INR"
  ) {
    throw new Error("The exchange-rate response was invalid.");
  }

  const result = {
    rate: data.rate,
    date: data.date,
  };

  rateCache.set(sourceCurrency, result);

  return result;
};

/**
 * Convert an amount to INR without modifying the original expense.
 */
export const convertToINR = async (amount, currency) => {
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount)) {
    throw new Error("Invalid expense amount.");
  }

  const { rate, date } = await getRateToINR(currency);

  return {
    amount: parsedAmount * rate,
    rate,
    date,
    currency: "INR",
  };
};
