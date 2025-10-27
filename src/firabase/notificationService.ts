// src/hooks/useNotification.ts
import { useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';

/**
 * ✅ Respecte le principe de dépendance inversée :
 * Le hook dépend d'une abstraction (service), pas d'une implémentation concrète
 */

export default function useNotification() {
  useEffect(() => {
    const notificationService = new NotificationService();

    const init = async () => {
      await notificationService.requestPermission();
      const token = await notificationService.getToken();
      if (token) {
        await notificationService.sendTokenToServer(token);
      }
    };

    init();
  }, []);
}
