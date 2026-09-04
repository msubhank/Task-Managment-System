import axios from 'axios';

// Base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Attach JWT token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if token expired or unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect if needed in Phase 2
      const isAuthRequest = error.config.url.includes('/auth/');
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Health check service
export const checkHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Cannot connect to backend server' };
  }
};

export default api;
