import apiClient from "./client";

export const destinationsApi = {
  getAll: (params = {}) => apiClient.get("/destinations", { params }),
  search: (q) => apiClient.get("/destinations/search", { params: { q } }),
  getById: (id) => apiClient.get(`/destinations/${id}`),
};
