// src/hooks/useNotification.ts
import { useEffect } from 'react';
import { PermissionsAndroid, Alert, Platform } from 'react-native';
import { NotificationService } from '../services/notifications/NotificationService';

export default function useNotification(userId: number | null) {
  useEffect(() => {
    const initNotifications = async () => {
      const notificationService = new NotificationService();

      // Demander la permission
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log('❌ Permission notifications refusée');
            return;
          }
        } else {
          await notificationService.requestPermission();
        }
      } catch (error) {
        console.error('Erreur permission notifications :', error);
        return;
      }

      // Récupérer et envoyer le token si nécessaire
      const token = await notificationService.getToken();
      if (token) {
        await notificationService.sendTokenToServer(token, userId);
      }
    };

    initNotifications();
  }, [userId]);
}
