
import api from '../../api/axiosConfig';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';

const authService = {
  /**
   * Connecte un utilisateur
   * @param credentials - Les identifiants de connexion
   * @returns Les données d'authentification
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/users/login/', credentials);
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string } } };
        // Erreur avec réponse du serveur
        throw new Error(axiosError.response?.data?.detail || 'Échec de la connexion');
      } else if (error && typeof error === 'object' && 'request' in error) {
        // Pas de réponse du serveur
        throw new Error('Pas de réponse du serveur. Vérifiez votre connexion.');
      }
      // Erreur inconnue
      throw new Error('Une erreur inattendue est survenue');
    }
  },

  /**
   * Enregistre un nouvel utilisateur
   * @param userData - Les données d'inscription
   * @returns Les données d'authentification
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    console.log(userData)
    try {
      const response = await api.post('/users/register/', userData);
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: Record<string, unknown> } };
        const errorData = axiosError.response?.data;
        
        if (errorData && typeof errorData === 'object') {
          // Gestion des erreurs de validation
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${String(messages)}`;
            })
            .join('\n');
          
          if (errorMessages) {
            throw new Error(errorMessages);
          }
        }
      }
      throw new Error("Une erreur est survenue lors de l'inscription");
    }
  },

  /**
   * Rafraîchit le token d'accès
   * @param refreshToken - Le token de rafraîchissement
   * @returns Le nouveau token d'accès
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await api.post('/users/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
      }
      throw new Error('Échec du rafraîchissement du token. Veuillez vous reconnecter.');
    }
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns Les informations du profil utilisateur
   */
  async getProfile(): Promise<any> {
    try {
      const response = await api.get('/user/profile/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      await api.post('/users/logout/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // On continue même en cas d'erreur pour s'assurer que l'utilisateur est bien déconnecté
    }
  },
};

export default authService;
