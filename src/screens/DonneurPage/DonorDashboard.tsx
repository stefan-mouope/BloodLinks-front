// screens/DonorDashboard.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { theme } from '../../constants/theme';
import useNotificationListener from '../../firabase/useNotificationListener';

interface AlertData {
  id: string;
  bloodType: string;
  hospital: string;
  distance: string;
  time: string;
  urgency: string;
  units: number;
}

const DonorDashboard = ({ navigation }: any) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const processedIds = useRef(new Set<string>()); // 🔥 Garde en mémoire les IDs traités

  // 🔥 Callback pour recevoir les notifications
  const handleNotification = useCallback((data: any) => {
    console.log('🧠 Nouvelle donnée Firebase reçue:', data);

    // Génère un ID unique basé sur les données
    const uniqueId = data.id || `${data.bloodType}-${data.hospital}-${Date.now()}`;

    // 🚫 Vérifie si déjà traité
    if (processedIds.current.has(uniqueId)) {
      console.log('⏭️ Notification déjà traitée, skip:', uniqueId);
      return;
    }

    // Marque comme traité
    processedIds.current.add(uniqueId);

    const newAlert: AlertData = {
      id: uniqueId,
      bloodType: data.bloodType || 'Inconnu',
      hospital: data.hospital || 'Non spécifié',
      distance: data.distance || '—',
      time: 'Maintenant',
      urgency: data.urgency || 'Normal',
      units: Number(data.units) || 1,
    };

    setAlerts((prev) => {
      // Double vérification pour éviter les doublons dans l'état
      const exists = prev.some((alert) => alert.id === newAlert.id);
      if (exists) {
        console.log('⚠️ Alerte déjà dans la liste:', newAlert.id);
        return prev;
      }
      
      console.log('✅ Ajout de la nouvelle alerte:', newAlert.id);
      return [newAlert, ...prev]; // ajoute en haut de la liste
    });

    // Nettoie l'ID après 10 secondes pour permettre les duplicatas ultérieurs
    setTimeout(() => {
      processedIds.current.delete(uniqueId);
    }, 10000);
  }, []);

  // 🎯 Active le listener avec le callback (UNE SEULE FOIS)
  useNotificationListener(handleNotification);

  // Exemple : notification simulée par défaut (optionnel - à retirer en prod)
  useEffect(() => {
    setAlerts([
      {
        id: 'demo-1',
        bloodType: 'A+',
        hospital: 'Hôpital Central',
        distance: '2.5 km',
        time: 'Il y a 5 min',
        urgency: 'Critique',
        units: 2,
      },
    ]);
  }, []);

  // Fonction pour attribuer les couleurs selon l'urgence
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critique':
        return { bg: '#FED7D7', text: '#C53030' };
      case 'Urgent':
        return { bg: '#FEEBC8', text: '#C05621' };
      case 'Normal':
        return { bg: '#BEE3F8', text: '#2C5282' };
      default:
        return { bg: theme.colors.gray100, text: theme.colors.gray600 };
    }
  };

  // Lorsqu'un donneur accepte une demande
  const handleAccept = useCallback((alert: AlertData) => {
    Alert.alert(
      'Confirmer le don',
      `Confirmez-vous votre disponibilité pour donner du sang ${alert.bloodType} à ${alert.hospital} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            // Retire l'alerte de la liste
            setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
            Alert.alert('Merci !', 'Votre confirmation a été envoyée.', [
              { text: 'OK' },
            ]);
          },
        },
      ]
    );
  }, []);

  // Lorsqu'un donneur refuse une demande
  const handleDecline = useCallback((alert: AlertData) => {
    // Retire l'alerte de la liste
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    Alert.alert('Refusé', 'Vous avez décliné cette demande de don.');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          Alertes reçues ({alerts.length})
        </Text>

        {alerts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🔔 Aucune alerte pour le moment</Text>
          </View>
        )}

        {alerts.map((alert) => {
          const urgencyColors = getUrgencyColor(alert.urgency);
          return (
            <View key={alert.id} style={[styles.alertCard, { borderColor: urgencyColors.bg }]}>
              <View style={styles.alertHeader}>
                <View style={[styles.bloodIconContainer, { backgroundColor: urgencyColors.bg }]}>
                  <Text style={{ fontSize: 24 }}>🩸</Text>
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>
                    Don de sang {alert.bloodType} requis
                  </Text>
                  <Text style={styles.infoText}>🏥 {alert.hospital}</Text>
                  <Text style={styles.infoText}>📍 {alert.distance} • ⏰ {alert.time}</Text>
                  <Text style={styles.infoText}>🩸 {alert.units} unités requises</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAccept(alert)}
                >
                  <Text style={{ fontSize: 20, marginRight: 4 }}>✅</Text>
                  <Text style={styles.acceptButtonText}>Accepter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => handleDecline(alert)}
                >
                  <Text style={{ fontSize: 20, marginRight: 4 }}>❌</Text>
                  <Text style={styles.declineButtonText}>Refuser</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonorDashboard;

// =======================
// STYLES
// =======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.gray700,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48BB78',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53E3E',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  declineButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});