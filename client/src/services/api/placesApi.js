import apiClient from "./client";

export const placesApi = {
  search: (data) => apiClient.post("/booking/places/search", data),
};
