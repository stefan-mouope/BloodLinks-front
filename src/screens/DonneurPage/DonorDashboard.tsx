import React, { useState } from 'react';
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


interface AlertItem {
  id: string;
  bloodType: string;
  hospital: string;
  distance: string;
  time: string;
  urgency: 'Normal' | 'Urgent' | 'Critique';
  units: number;
}

const DonorDashboard = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('alertes');
  const [notificationCount] = useState(2);

  const alerts: AlertItem[] = [
    {
      id: '1',
      bloodType: 'A+',
      hospital: 'Hôpital Central',
      distance: '2.5 km',
      time: 'Il y a 5 min',
      urgency: 'Critique',
      units: 2,
    },
    {
      id: '2',
      bloodType: 'A+',
      hospital: 'Clinique Est',
      distance: '5.1 km',
      time: 'Il y a 1h',
      urgency: 'Urgent',
      units: 1,
    },
  ];

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

  const handleAccept = (alert: AlertItem) => {
    Alert.alert(
      'Confirmer le don',
      `Vous confirmez votre disponibilité pour donner du sang ${alert.bloodType} à ${alert.hospital}?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            Alert.alert(
              'Merci!',
              'Votre confirmation a été envoyée. Vous recevrez les détails par SMS.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleDecline = (alert: AlertItem) => {
    Alert.alert('Refusé', 'Vous avez décliné cette demande de don.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />


      {/* Contribution Card */}
      <View style={styles.contributionCard}>
        <View style={styles.contributionHeader}>
          <Text style={{ fontSize: 32, marginRight: 8 }}>❤️</Text>
          <View>
            <Text style={styles.contributionLabel}>Votre contribution</Text>
            <Text style={styles.contributionValue}>8 dons</Text>
          </View>
        </View>
        <Text style={styles.contributionSubtext}>
          Prochain don disponible dans 45 jours
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Alertes reçues</Text>

        {alerts.map((alert) => {
          const urgencyColors = getUrgencyColor(alert.urgency);
          return (
            <View
              key={alert.id}
              style={[styles.alertCard, { borderColor: urgencyColors.bg }]}
            >
              <View style={styles.alertHeader}>
                <View
                  style={[styles.bloodIconContainer, { backgroundColor: urgencyColors.bg }]}
                >
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

              {/* Action Buttons */}
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

        {/* Empty State */}
        {alerts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 64 }}>🔕</Text>
            <Text style={styles.emptyStateTitle}>Aucune alerte</Text>
            <Text style={styles.emptyStateText}>
              Vous recevrez une notification quand votre sang sera requis
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('alertes')}
        >
          <Text style={{ fontSize: 24 }}>🔔</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'alertes' && { color: theme.colors.primary },
            ]}
          >
            Alertes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('historique')}
        >
          <Text style={{ fontSize: 24 }}>⏱️</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'historique' && { color: theme.colors.primary },
            ]}
          >
            Historique
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profil')}
        >
          <Text style={{ fontSize: 24 }}>👤</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'profil' && { color: theme.colors.primary },
            ]}
          >
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contributionCard: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  contributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  contributionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    opacity: 0.9,
  },
  contributionValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  contributionSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    opacity: 0.9,
  },
  content: { flex: 1, backgroundColor: theme.colors.gray50 },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  alertCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    ...theme.shadows.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  bloodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: { flex: 1 },
  alertTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  acceptButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  declineButton: {
    flex: 1,
    backgroundColor: theme.colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  declineButtonText: {
    color: theme.colors.gray600,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default DonorDashboard;
