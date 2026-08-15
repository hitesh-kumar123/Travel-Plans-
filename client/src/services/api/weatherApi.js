import apiClient from "./client";

export const weatherApi = {
  getCurrent: (location) =>
    apiClient.get(`/weather/current/${encodeURIComponent(location)}`),
  getForecast: (location) =>
    apiClient.get(`/weather/forecast/${encodeURIComponent(location)}`),
};
