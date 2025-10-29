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
        navigation?: NavigationProp<RootStackParamList>
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { user, access, refresh } = await authService.login(credentials);
          console.log(user,access,refresh)
          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // ✅ Navigation après connexion selon le rôle
          if (navigation) {
            switch (user.user_type) {
              case 'donneur':
                navigation.navigate('donor');
                break;
              case 'docteur':
                navigation.navigate('doctor');
                break;
              case 'banque':
                navigation.navigate('banque');
                break;
              default:
                navigation.navigate('Home'); // Fallback
                break;
            }
          }

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
      register: async (
        userData: RegisterData,
        navigation?: NavigationProp<RootStackParamList>
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(userData);

          // Si le backend retourne aussi les tokens → connexion automatique
          if (response.access && response.refresh) {
            set({
              user: response.user,
              accessToken: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            //  Navigation après inscription selon le rôle
            if (navigation) {
              switch (response.user.user_type) {
                case 'donneur':
                  navigation.navigate('donor');
                  break;
                case 'docteur':
                  navigation.navigate('login');
                  break;
                case 'banque':
                  navigation.navigate('login');
                  break;
                default:
                  navigation.navigate('Home');
                  break;
              }
            }

            return response.user;
          }

          // Si le backend ne renvoie pas de tokens → succès sans connexion
          set({ isLoading: false, error: null });
          return response.user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Échec de l'inscription";
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
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
