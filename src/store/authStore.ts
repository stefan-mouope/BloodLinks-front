import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth/authService';
import { AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { NavigationProp } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';
import { RootStackParamList } from '../screens/FirstPage/types';

let _hasHydrated = false;

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 🔐 Connexion
      login: async (
        credentials: LoginCredentials,
       
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { user, access, refresh } = await authService.login(credentials);
          console.log(user,access,refresh)
          set({
            user,
            accessToken: access,
            refreshToken: refresh ,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Échec de la connexion';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // 🧾 Inscription
      register: async (userData: RegisterData) => {
  set({ isLoading: true, error: null });
  try {
    const response = await authService.register(userData);

    // Si succès
    set({
      isLoading: false,
      error: null,
      user: response.user ?? null,
      accessToken: response.access ?? null,
      refreshToken: response.refresh ?? null,
      isAuthenticated: !!(response.access && response.refresh),
    });

    return true; // ✅ renvoie toujours un booléen en cas de succès
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Échec de l'inscription";
    set({
      error: errorMessage,
      isLoading: false,
      isAuthenticated: false,
    });
    return false; // ✅ renvoie false en cas d’échec
  }
},
      // 🚪 Déconnexion
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

      // 🔍 Vérification de l’authentification
   checkAuth: async () => {
  const { user, accessToken, refreshToken } = get();
// Alert.alert('test')
console.log(user)
  // Si aucune donnée n’est enregistrée → pas connecté
  if (!user || !accessToken || !refreshToken) {
    set({
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  }

  // Sinon, on considère l’utilisateur comme connecté
  set({
    isAuthenticated: true,
    isLoading: false,
    user,
    accessToken,
    refreshToken,
    error: null,
  });

  return true;
},

      // 🔁 Rafraîchissement du token
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
          await get().logout();
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: AuthState) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => () => {
        _hasHydrated = true;
        console.log('Rehydration terminée ✅');
      },
    }
  )
);

export { _hasHydrated };
export default useAuthStore;
