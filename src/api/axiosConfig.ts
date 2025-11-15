import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import useAuthStore from '../store/authStore';

// Détermine l'URL de base selon l'environnement
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api/'; // Émulateur Android
    }
    return 'http://192.168.209.150:8000/api/'; // Téléphone physique
  }
  return 'https://bloodlinks.onrender.com/api/';
};

// Routes publiques (accessibles sans token et sans refresh)
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/refresh', 
  '/banques'
];

// Vérifie si une URL correspond à une route publique
const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

// Création de l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur REQUEST → ajoute le token SAUF pour les routes publiques
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Ne pas ajouter le token pour les routes publiques
    if (!isPublicRoute(config.url || '')) {
      const { accessToken } = useAuthStore.getState();
      console.log('Access Token utilisé :', accessToken);
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur RESPONSE → gère les erreurs et le refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 1. Ne PAS tenter de refresh pour les routes publiques
    if (isPublicRoute(originalRequest.url || '')) {
      return Promise.reject(error);
    }

    // 🔥 2. Si erreur 401 et pas encore retry → faire refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshAccessToken } = useAuthStore.getState();
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // Réinjecter le nouveau token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Rejoue la requête
        }
      } catch (refreshError) {
        // Si refresh échoue → déconnexion
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;