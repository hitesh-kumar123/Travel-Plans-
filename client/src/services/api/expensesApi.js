import apiClient from "./client";

export const expensesApi = {
  getAll: (params = { page: 1, limit: 50 }) =>
    apiClient.get("/expenses", { params }),
  getByTrip: (tripId, params = { page: 1, limit: 50 }) =>
    apiClient.get(`/expenses/trip/${tripId}`, { params }),
  getSummary: (tripId) => apiClient.get(`/expenses/summary/${tripId}`),
  create: (data) => apiClient.post("/expenses", data),
  update: (id, data) => apiClient.put(`/expenses/${id}`, data),
  delete: (id) => apiClient.delete(`/expenses/${id}`),
};
