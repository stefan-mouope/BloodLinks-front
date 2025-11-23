// src/hooks/useNotification.ts
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { NotificationService } from '../services/notifications/NotificationService';

export default function useNotification(userId: number | null) {
  useEffect(() => {
    if (!userId) return;

    const initNotifications = async () => {
      const notificationService = new NotificationService();

      try {
         await notificationService.requestPermission();
        // Demander la permission notifications
      //   if (Platform.OS === 'android') {
      //     const granted = await PermissionsAndroid.request(
      //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      //     );
      //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      //       console.log('❌ Permission notifications refusée');
      //       return;
      //     }
      //   } else {
      //     await notificationService.requestPermission();
      //   }
      } catch (error) {
        console.error('Erreur permission notifications :', error);
        return;
      }

      // Récupérer le token FCM
      const token = await notificationService.getToken();
      if (token) {
        console.log('✅ Token FCM obtenu:', token);
        await notificationService.sendTokenToServer(token, userId);
      }
    };

    initNotifications();
  }, [userId]);
}
