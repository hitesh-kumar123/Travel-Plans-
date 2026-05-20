import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://api.frankfurter.app";

// Module-level cache: { "INR": { rates: {...}, fetchedAt: timestamp } }
const ratesCache = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "SGD",
  "AED",
  "THB",
];

const useCurrencyConverter = (homeCurrency = "INR") => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const fetchRates = async () => {
      // Return cached rates if still fresh
      const cached = ratesCache[homeCurrency];
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        setRates(cached.rates);
        return;
      }

      setLoading(true);
      setError(null);

      // Cancel previous in-flight request
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        // Fetch rates relative to homeCurrency
        const res = await fetch(
          `${BASE_URL}/latest?from=${homeCurrency}&to=${SUPPORTED_CURRENCIES.filter((c) => c !== homeCurrency).join(",")}`,
          { signal: abortRef.current.signal },
        );

        if (!res.ok) throw new Error("Failed to fetch exchange rates");

        const data = await res.json();

        // Add 1:1 rate for home currency itself
        const allRates = { ...data.rates, [homeCurrency]: 1 };

        ratesCache[homeCurrency] = { rates: allRates, fetchedAt: Date.now() };
        setRates(allRates);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not fetch exchange rates. Showing original amounts.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRates();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [homeCurrency]);

  /**
   * Convert an amount from `fromCurrency` to `homeCurrency`.
   * Returns null if rates aren't loaded yet.
   */
  const convert = (amount, fromCurrency) => {
    if (!amount || !fromCurrency || fromCurrency === homeCurrency) {
      return parseFloat(amount) || 0;
    }
    const rate = rates[fromCurrency];
    if (!rate) return null;
    // rates are "1 homeCurrency = X foreignCurrency"
    // so to go back: amount / rate
    return parseFloat((parseFloat(amount) / rate).toFixed(2));
  };

  return { rates, loading, error, convert };
};

export default useCurrencyConverter;
