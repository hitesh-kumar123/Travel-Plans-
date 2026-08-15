import apiClient from "./client";

export const authApi = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  googleAuth: (credential) => apiClient.post("/auth/google", { credential }),
  verifyEmail: (token) => apiClient.get(`/auth/verify-email/${token}`),
  getProfile: () => apiClient.get("/auth/profile"),
  updateProfile: (data) => apiClient.put("/auth/profile", data),
  changePassword: (data) => apiClient.put("/auth/change-password", data),
  forgotPassword: (data) => apiClient.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    apiClient.put(`/auth/reset-password/${token}`, data),
  requestEmailChange: (data) =>
    apiClient.post("/auth/request-email-change", data),
  verifyEmailChange: (data) =>
    apiClient.post("/auth/verify-email-change", data),
  getEmailChangeStatus: () => apiClient.get("/auth/email-change-status"),
};
