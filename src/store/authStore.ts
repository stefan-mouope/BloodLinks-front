import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth/authService';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth';

// Configuration du stockage personnalisé pour Zustand
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    return value;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // État initial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Connexion
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, access, refresh } = await authService.login(credentials);
          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Échec de la connexion';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Inscription
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, access, refresh } = await authService.register(userData);
          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Échec de l'inscription";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // Déconnexion
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // Vérification de l'authentification
      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) return false;

        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }
      },

      // Rafraîchissement du token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return null;

        try {
          const { access } = await authService.refreshToken(refreshToken);
          set({ accessToken: access });
          return access;
        } catch (error) {
          // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
          get().logout();
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value;
        },
        setItem: async (name: string, value: string) => {
          await AsyncStorage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      })),
      partialize: (state: AuthState) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
