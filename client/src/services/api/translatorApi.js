import apiClient from "./client";

export const translatorApi = {
  getLanguages: () => apiClient.get("/translator/languages"),
  translate: (data) => apiClient.post("/translator/translate", data),
};
