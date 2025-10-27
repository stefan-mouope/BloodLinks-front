import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuth from '../../hooks/useAuth';
import { RootStackParamList } from '../../navigation/AppNavigator';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  loadingComponent?: React.ReactNode;
}

/**
 * Composant de route protégée qui vérifie l'authentification et les rôles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  loadingComponent,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth(requiredRoles);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Rediriger vers la page de connexion si non authentifié
        navigation.navigate('Login');
        return;
      }

      // Vérifier les rôles si nécessaire
      if (requiredRoles.length > 0 && user?.user_type) {
        const hasRequiredRole = requiredRoles.some(
          role => role.toLowerCase() === user.user_type?.toLowerCase()
        );

        if (!hasRequiredRole) {
          // Rediriger vers une page d'accès refusé ou d'accueil
navigation.navigate('Home');
          return;
        }
      }

      // Si tout est bon, autoriser l'accès
      setIsAuthorized(true);
    }
  }, [isAuthenticated, isLoading, navigation, requiredRoles, user]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading || !isAuthorized) {
    return loadingComponent || (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Rendre les enfants si l'utilisateur est authentifié et autorisé
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProtectedRoute;
