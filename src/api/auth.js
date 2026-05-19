import api from "./axios";

export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const changePassword = (data) => api.put("/auth/change-password", data);
export const updateSecurityQuestion = (data) =>
  api.patch("/auth/security-question", data);
