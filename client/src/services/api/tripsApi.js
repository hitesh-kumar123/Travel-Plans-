import apiClient from "./client";

export const tripsApi = {
  getAll: (params = { page: 1, limit: 20 }) =>
    apiClient.get("/trips", { params }),
  getById: (id) => apiClient.get(`/trips/${id}`),
  create: (data) => apiClient.post("/trips", data),
  update: (id, data) => apiClient.put(`/trips/${id}`, data),
  delete: (id) => apiClient.delete(`/trips/${id}`),
  generateShareLink: (id) => apiClient.post(`/trips/${id}/share`),
  toggleSharing: (id) => apiClient.put(`/trips/${id}/share-toggle`),
  getSharedTrip: (token) => apiClient.get(`/trips/share/${token}`),
};
