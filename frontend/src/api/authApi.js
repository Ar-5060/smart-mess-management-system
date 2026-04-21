import api from "./axios";

export const registerUser = (userData) => {
  return api.post("/api/auth/register", userData);
};