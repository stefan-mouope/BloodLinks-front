import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import useAuthStore from '../store/authStore';

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api/';
    }
    return 'http://192.168.0.106:8000/api/';
  }
  return 'https://bloodlinks.onrender.com/api/';
};

const PUBLIC_ROUTES = ['/login', '/register', '/refresh', '/banques'];

const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔥 Empêche plusieurs refresh simultanés
let isRefreshing = false;

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!isPublicRoute(config.url || '')) {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 Ne jamais refresh une route publique
    if (isPublicRoute(originalRequest.url || '')) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // ❌ Si c’est une erreur 401 sur /refresh → logout immédiat
    if (originalRequest.url.includes('/refresh') && status === 401) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // ❌ Si erreur 401 et pas encore retry → tenter le refresh
    if (status === 401 && !originalRequest._retry) {
      // Empêcher la boucle
      originalRequest._retry = true;

      // Si un refresh est déjà en cours → on rejette
      if (isRefreshing) {
        return Promise.reject(error);
      }

      isRefreshing = true;

      try {
        const { refreshAccessToken } = useAuthStore.getState();
        const newAccessToken = await refreshAccessToken();

        isRefreshing = false;

        if (!newAccessToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // Réinjecter le token et relancer la requête
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError: any) {
        isRefreshing = false;

        // ❌ Si refresh renvoie 401 → logout
        if (refreshError.response?.status === 401) {
          useAuthStore.getState().logout();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
