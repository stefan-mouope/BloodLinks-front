import { useEffect, useRef } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { AppState, Alert, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface NotificationData {
  id?: string;
  bloodType?: string;
  hospital?: string;
  distance?: string;
  urgency?: 'Normal' | 'Urgent' | 'Critique';
  units?: string;
  [key: string]: any;
}

// 🔥 VARIABLES GLOBALES (en dehors du hook)
let globalUnsubscribeOnMessage: (() => void) | null = null;
let globalUnsubscribeOnOpened: (() => void) | null = null;
let globalAppStateListener: any = null;
let isInitialized = false;
const processedNotifications = new Set<string>();

// Callback global qui sera mis à jour
let globalCallback: ((data: NotificationData) => void) | null = null;

/**
 * Hook global pour écouter les notifications Firebase
 * ⚠️ CE HOOK NE DOIT ÊTRE APPELÉ QU'UNE SEULE FOIS DANS TOUTE L'APP
 */
const useNotificationListener = (
  onNotificationReceived?: (data: NotificationData) => void
) => {
  const navigation = useNavigation<any>();

  // Met à jour le callback global sans recréer les listeners
  useEffect(() => {
    globalCallback = onNotificationReceived || null;
  }, [onNotificationReceived]);

  useEffect(() => {
    // 🚫 SI DÉJÀ INITIALISÉ, ON NE FAIT RIEN
    if (isInitialized) {
      console.log('⚠️ Listeners Firebase déjà actifs, skip initialisation');
      return;
    }

    console.log('🔔 PREMIÈRE initialisation des listeners Firebase');
    isInitialized = true;

    // Helper pour éviter les doublons
    const processNotification = (data: NotificationData, source: string) => {
      const notifId = data.id || `${data.bloodType}-${data.hospital}-${Date.now()}`;
      
      if (processedNotifications.has(notifId)) {
        console.log(`⏭️ [${source}] Notification déjà traitée:`, notifId);
        return false;
      }

      console.log(`✅ [${source}] Traitement nouvelle notification:`, notifId);
      processedNotifications.add(notifId);
      
      // Nettoie après 10 secondes
      setTimeout(() => {
        processedNotifications.delete(notifId);
      }, 10000);

      return true;
    };

    // ==============================
    // 1️⃣ App ouverte (foreground)
    // ==============================
    globalUnsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('📩 [FOREGROUND] Notification reçue:', remoteMessage.data);

        if (remoteMessage?.data) {
          const data: NotificationData = remoteMessage.data;
          
          // Vérifie les doublons
          if (!processNotification(data, 'foreground')) return;

          // Appel du callback
          if (globalCallback) {
            globalCallback(data);
          }

          Alert.alert(
            remoteMessage.notification?.title || 'Nouvelle alerte',
            remoteMessage.notification?.body ||
              `Don de sang ${data.bloodType || 'inconnu'} requis à ${
                data.hospital || 'Hôpital non précisé'
              }`,
            [
              {
                text: 'Voir',
                onPress: () =>
                  navigation.navigate('AlertDetails', { notification: data }),
              },
              { text: 'Fermer', style: 'cancel' },
            ]
          );
        }
      }
    );

    // ==============================
    // 2️⃣ App en arrière-plan (clic sur notif)
    // ==============================
    globalUnsubscribeOnOpened = messaging().onNotificationOpenedApp(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('🔙 [BACKGROUND] Notification ouverte:', remoteMessage.data);

        if (remoteMessage?.data) {
          const data: NotificationData = remoteMessage.data;
          
          if (!processNotification(data, 'background')) return;

          if (globalCallback) {
            globalCallback(data);
          }

          navigation.navigate('AlertDetails', {
            notification: remoteMessage.data,
          });
        }
      }
    );

    // ==============================
    // 3️⃣ App fermée (cold start)
    // ==============================
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('🧊 [COLD START] Notification ouverte:', remoteMessage.data);
          
          const data: NotificationData = remoteMessage.data || {};
          
          if (!processNotification(data, 'cold-start')) return;

          if (globalCallback) {
            globalCallback(data);
          }

          navigation.navigate('AlertDetails', {
            notification: remoteMessage.data,
          });
        }
      });

    // ==============================
    // 4️⃣ Surveillance AppState
    // ==============================
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(`📱 AppState changé: ${nextAppState}`);
    };

    globalAppStateListener = AppState.addEventListener('change', handleAppStateChange);

    console.log('✅ Listeners Firebase initialisés avec succès');

    // ==============================
    // 🧹 Nettoyage (ne devrait jamais arriver normalement)
    // ==============================
    return () => {
      console.log('🧹 Nettoyage des listeners Firebase');
      
      if (globalUnsubscribeOnMessage) {
        globalUnsubscribeOnMessage();
        globalUnsubscribeOnMessage = null;
      }
      
      if (globalUnsubscribeOnOpened) {
        globalUnsubscribeOnOpened();
        globalUnsubscribeOnOpened = null;
      }
      
      if (globalAppStateListener) {
        globalAppStateListener.remove();
        globalAppStateListener = null;
      }
      
      isInitialized = false;
      processedNotifications.clear();
      globalCallback = null;
    };
  }, []); // 🔥 Dépendances vides = s'exécute UNE SEULE FOIS
};

export default useNotificationListener;
