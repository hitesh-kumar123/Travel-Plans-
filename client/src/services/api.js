import axios from "axios";

// Use the client environment variable when available.
// In production, a missing REACT_APP_API_URL should still route through
// the backend prefix at the same origin.
const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5000/api");

// Create an axios instance with defaults
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
// Frankfurter is a free, open-source exchange-rate API — no key required.
// We always fetch with base=INR so we can use INR as a universal pivot
// to convert between any two currencies stored in the app.
const FRANKFURTER_BASE_URL =
  process.env.REACT_APP_FRANKFURTER_API_URL || "https://api.frankfurter.dev/v1";

export const getCurrencyRates = (base = "INR") =>
  axios.get(`${FRANKFURTER_BASE_URL}/latest?base=${base}`);

export default api;
