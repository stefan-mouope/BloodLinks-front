import { AxiosError } from 'axios';
import { Alert } from 'react-native';

/**
 * Gère les erreurs d'API et retourne un message d'erreur convivial
 * @param error - L'erreur à traiter
 * @returns Un message d'erreur convivial
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Erreur réseau
    if (!error.response) {
      return 'Erreur de connexion. Vérifiez votre connexion Internet.';
    }

    const { status, data } = error.response;
    
    // Erreurs de validation
    if (status === 400 && data) {
      if (typeof data === 'object' && data !== null) {
        // Traitement des erreurs de validation
        if (Array.isArray(data)) {
          return data.join('\n');
        }
        
        // Traitement des erreurs au format { field: [message] }
        return Object.entries(data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          })
          .join('\n');
      }
      
      return data.detail || 'Une erreur est survenue';
    }

    // Erreurs d'authentification
    if (status === 401) {
      return 'Session expirée. Veuillez vous reconnecter.';
    }

    // Erreurs d'autorisation
    if (status === 403) {
      return "Vous n'avez pas les droits pour effectuer cette action.";
    }

    // Erreurs serveur
    if (status >= 500) {
      return 'Erreur serveur. Veuillez réessayer plus tard.';
    }
  }

  // Erreur inconnue
  console.error('Erreur inconnue:', error);
  return 'Une erreur inattendue est survenue.';
};

/**
 * Exécute une action avec gestion d'erreur
 * @param action - L'action à exécuter
 * @param onError - Callback appelé en cas d'erreur (optionnel)
 * @returns Le résultat de l'action ou undefined en cas d'erreur
 */
export const withErrorHandling = async <T,>(
  action: () => Promise<T>,
  onError?: (message: string) => void
): Promise<T | undefined> => {
  try {
    return await action();
  } catch (error) {
    const errorMessage = handleApiError(error);
    
    if (onError) {
      onError(errorMessage);
    } else {
      Alert.alert('Erreur', errorMessage);
    }
    
    return undefined;
  }
};

/**
 * Affiche une alerte d'erreur
 * @param error - L'erreur à afficher
 * @param defaultMessage - Message par défaut si l'erreur ne peut pas être traitée
 */
export const showErrorAlert = (
  error: unknown, 
  defaultMessage: string = 'Une erreur est survenue'
): void => {
  const message = error instanceof Error ? error.message : defaultMessage;
  Alert.alert('Erreur', message);
};
