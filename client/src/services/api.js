import axios from "axios";
import { toast } from "react-toastify";

// Standard professional approach: Strictly using environment variable with fallback
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

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
