import axios from "axios";
import { toast } from "react-toastify";

const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) {
    return process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:5000/api";
  }

  const trimmedBaseUrl = baseUrl.replace(/\/$/, "");
  return trimmedBaseUrl.endsWith("/api") ? trimmedBaseUrl : `${trimmedBaseUrl}/api`;
};

const API_BASE = normalizeApiBase(process.env.REACT_APP_API_URL);

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
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  },
);

export default api;
