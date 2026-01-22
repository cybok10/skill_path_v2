import axios from 'axios';
import { getCurrentUser } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/api/auth/signin' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const user = getCurrentUser();
          if (!user || !user.refreshToken) {
            // If no refresh token, logout
            window.location.href = '/';
            return Promise.reject("No refresh token");
          }

          const rs = await api.post('/api/auth/refreshtoken', {
            refreshToken: user.refreshToken,
          });

          const { accessToken } = rs.data;
          const updatedUser = { ...user, token: accessToken };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          originalConfig.headers['Authorization'] = 'Bearer ' + accessToken;

          return api(originalConfig);
        } catch (_error) {
          // Refresh token failed, logout
          localStorage.removeItem('user');
          window.location.href = '/';
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default api;
