import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuthStore from '../store/authStore';
import { RootStackParamList } from '../navigation/AppNavigator';

/**
 * Hook personnalisé pour gérer l'authentification
 * @param requiredRoles - Rôles requis pour accéder à la ressource (optionnel)
 * @returns Les propriétés et méthodes d'authentification
 */
const useAuth = (requiredRoles?: string[]) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    register, 
    logout, 
    checkAuth 
  } = useAuthStore();

  // Vérifier l'authentification au chargement et lorsque l'authentification change
  useEffect(() => {
    const verifyAuth = async () => {
      if (isLoading) return;
      
      const isAuth = await checkAuth();
      
      if (!isAuth) {
        // Rediriger vers l'écran de connexion si non authentifié
        navigation.navigate('Login');
      } else if (requiredRoles && requiredRoles.length > 0) {
        // Vérifier les rôles requis si spécifiés
        const hasRequiredRole = requiredRoles.some(role => 
          user?.user_type?.toLowerCase() === role.toLowerCase()
        );
        
        if (!hasRequiredRole) {
          // Rediriger vers une page d'accès refusé ou d'accueil
          navigation.navigate('Home');
        }
      }
    };

    verifyAuth();
  }, [isAuthenticated, isLoading, checkAuth, requiredRoles, user]);

  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Méthodes
    login,
    register,
    logout,
    checkAuth,
  };
};

export default useAuth;
