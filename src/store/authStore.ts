import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth/authService';
import { AuthState, User, LoginCredentials, RegisterData } from '../types/auth';

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
            error: null,
          });
          return user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Échec de la connexion';
          set({ error: errorMessage, isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      // Inscription
      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);
          
          // Si l'inscription retourne les tokens, connecter l'utilisateur
          if (response.access && response.refresh) {
            set({
              user: response.user,
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return response.user;
          }
          
          // Sinon, juste indiquer le succès
          set({
            isLoading: false,
            error: null,
          });
          return response.user;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Échec de l'inscription";
          set({ error: errorMessage, isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      // Déconnexion
      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
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
        if (!accessToken) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null,
          });
          return true;
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
          set({ 
            user: null,
            isAuthenticated: false, 
            isLoading: false,
            accessToken: null,
            refreshToken: null,
          });
          return false;
        }
      },

      // Rafraîchissement du token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          set({ isAuthenticated: false });
          return null;
        }

        try {
          const { access } = await authService.refreshToken(refreshToken);
          set({ accessToken: access, error: null });
          return access;
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du token:', error);
          // En cas d'erreur de rafraîchissement, déconnecter l'utilisateur
          await get().logout();
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value;
          } catch (error) {
            console.error('Erreur lors de la lecture du storage:', error);
            return null;
          }
        },
        setItem: async (name: string, value: string) => {
          try {
            await AsyncStorage.setItem(name, value);
          } catch (error) {
            console.error('Erreur lors de l\'écriture du storage:', error);
          }
        },
        removeItem: async (name: string) => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Erreur lors de la suppression du storage:', error);
          }
        },
      })),
      // Ne persister que les données nécessaires
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