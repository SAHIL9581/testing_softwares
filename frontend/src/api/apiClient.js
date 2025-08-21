import axios from 'axios';

// The base URL for your backend API, running in Docker.
// VITE_API_BASE_URL should be set to http://localhost:8000 in your frontend/.env file
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// This function runs before every API request is sent.
apiClient.interceptors.request.use(
  (config) => {
    // It gets the auth token from browser's local storage
    const token = localStorage.getItem('accessToken');
    // If the token exists, it adds it to the request header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;