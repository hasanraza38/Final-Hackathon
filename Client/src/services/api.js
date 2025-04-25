import axios from 'axios';
import { refreshAccessToken } from '../utils/auth.js';

const api = axios.create({
  baseURL: 'https://final-hackathon-production.up.railway.app/api/v1',
  withCredentials: true
});


api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        await refreshAccessToken()
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;