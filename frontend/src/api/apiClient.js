// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Change to your backend URL
  timeout: 10000, // 10 sec timeout
  headers: { "Content-Type": "application/json" }
});

// ✅ Add token to every request automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ✅ Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — logging out");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
