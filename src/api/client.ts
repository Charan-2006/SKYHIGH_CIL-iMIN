import axios from 'axios';

// Base API URL default to local FastAPI dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor to automatically attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carbon_cortex_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected routes, redirect to login unless on public page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        localStorage.removeItem('carbon_cortex_token');
        localStorage.removeItem('carbon_cortex_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
