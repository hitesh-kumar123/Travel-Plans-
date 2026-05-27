import axios from "axios";

// Standard professional approach: Strictly using environment variable
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const REQUEST_ID_HEADERS = ["x-request-id", "x-trace-id", "x-correlation-id"];

function getHeaderValue(headers, headerName) {
  if (!headers) return "";
  return headers[headerName] || headers[headerName.toLowerCase()] || headers[headerName.toUpperCase()] || "";
}

export function extractRequestId(headers) {
  for (const headerName of REQUEST_ID_HEADERS) {
    const value = getHeaderValue(headers, headerName);
    if (value) return value;
  }
  return "";
}

export function formatApiError(error, fallbackMessage = "Something went wrong") {
  const response = error?.response;
  const requestId = extractRequestId(response?.headers) || error?.requestId || response?.data?.requestId || response?.data?.traceId || "";
  const serverMessage = response?.data?.msg || response?.data?.error || error?.message || fallbackMessage;

  return {
    message: requestId ? `${serverMessage} (Request ID: ${requestId})` : serverMessage,
    requestId,
    status: response?.status || error?.status || null,
    url: error?.config?.url || "",
    method: (error?.config?.method || "").toUpperCase(),
    raw: error,
  };
}

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
    if (error?.response?.headers) {
      error.requestId = extractRequestId(error.response.headers);
    }
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

export default api;
