import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL || '/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_admin_token');
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gym_admin_token');
      localStorage.removeItem('gym_admin_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;