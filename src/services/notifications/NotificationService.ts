// src/services/NotificationService.ts
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import api from '../../api/axiosConfig';
import { INotificationService } from '../interfaces/INotificationService';
import { getAuthToken, saveAuthToken } from '../../store/NotificationStorage';

export class NotificationService implements INotificationService {
  async requestPermission(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Permission de notification accordée');
        } else {
          console.warn('❌ Permission refusée');
        }
      } else {
        await messaging().requestPermission();
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission :', error);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log(' Token FCM récupéré :', token);
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token :', error);
      return null;
    }
  }

  async sendTokenToServer(token: string, userId: number | null): Promise<void> {
    try {
      const storedToken = await getAuthToken();

      // Si le token est déjà envoyé, on ne renvoie rien
      if (storedToken === token) {
        console.log(' Token déjà enregistré, pas besoin de renvoyer');
        return;
      }

      await api.post('/notifications/fcm-tokens/', {
        user: userId ?? undefined,
        token,
        device_name: Platform.OS,
      });

      console.log('✅ Token envoyé au serveur avec succès');
      await saveAuthToken(token); // On stocke le token après l’envoi
    } catch (error: any) {
      console.error('❌ Erreur lors de l’envoi du token :', error?.response?.data || error.message || error);
    }
  }
}
