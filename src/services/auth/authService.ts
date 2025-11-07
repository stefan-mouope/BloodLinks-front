import api from '../../api/axiosConfig';
import { LoginCredentials, RegisterData, AuthResponse } from '../../types/auth';

const authService = {
  /**
   * 🔐 Connexion d’un utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('users/login/', credentials);
      console.log('🟢 Réponse login:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.detail || 'Échec de la connexion');
      } else if (error.request) {
        throw new Error('Pas de réponse du serveur. Vérifie ta connexion Internet.');
      } else {
        throw new Error('Une erreur inattendue est survenue.');
      }
    }
  },

  /**
   * 🧾 Inscription d’un utilisateur
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('users/register/', userData);
      console.log('🟢 Utilisateur enregistré:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) =>
            Array.isArray(messages)
              ? `${field}: ${messages.join(', ')}`
              : `${field}: ${String(messages)}`
          )
          .join('\n');
        throw new Error(errorMessages || "Erreur lors de l'inscription");
      }
      throw new Error("Une erreur est survenue lors de l'inscription");
    }
  },

  /**
   * 🔁 Rafraîchissement du token d’accès
   */
  async refreshToken(refreshToken: string): Promise<{ access: string }> {
    try {
      const response = await api.post('users/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw new Error('Échec du rafraîchissement du token.');
    }
  },

  /**
   * 👤 Récupération du profil utilisateur
   */
  async getProfile(): Promise<any> {
    try {
      const response = await api.get('users/profile/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  /**
   * 🚪 Déconnexion d’un utilisateur
   * Envoie le refresh token au backend pour le blacklister.
   */
  async logout(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      if (!refreshToken) {
        console.warn('⚠️ Aucun refresh token fourni — skip backend logout.');
        return;
      }

      console.log('📤 Envoi du logout au backend avec refresh:', refreshToken);

      await api.post(
        'users/logout/',
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Déconnexion réussie côté serveur');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error.response?.data || error.message);
      // On poursuit la déconnexion locale même si le serveur renvoie une erreur
    }
  },
};

export default authService;
