import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor for handling transient server restarts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If no response (server down), enhance the error message
    if (!error.response) {
      error.customMessage = `Network Error: ${error.message}. Url: ${config.url}`;
      console.error('Network Error detected! error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
