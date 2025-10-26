// screens/BloodBankDashboard.tsx
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
import { useNavigation } from '@react-navigation/native';

interface Request {
  id: string;
  bloodType: string;
  hospital: string;
  units: number;
  urgency: 'Normal' | 'Urgent' | 'Critique';
  requestedBy: string;
  time: string;
}

const BloodBankDashboard = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Demandes');
  const [notificationCount] = useState(3);

  const requests: Request[] = [
    {
      id: '1',
      bloodType: 'A+',
      hospital: 'Hôpital Central',
      units: 2,
      urgency: 'Urgent',
      requestedBy: 'Dr. Marie Dubois',
      time: 'Il y a 5 min',
    },
    {
      id: '2',
      bloodType: 'O-',
      hospital: 'Clinique Nord',
      units: 3,
      urgency: 'Critique',
      requestedBy: 'Dr. Jean Kamga',
      time: 'Il y a 15 min',
    },
    {
      id: '3',
      bloodType: 'B+',
      hospital: 'Hôpital Sud',
      units: 1,
      urgency: 'Normal',
      requestedBy: 'Dr. Paul Mbida',
      time: 'Il y a 1h',
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

  const handleSendAlert = (request: Request) => {
    Alert.alert(
      'Envoyer une alerte',
      `Voulez-vous envoyer une alerte aux donneurs ${request.bloodType} pour ${request.hospital}?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Envoyer',
          onPress: () => {
            Alert.alert('Succès', 'Alerte envoyée aux donneurs avec succès');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Requêtes actives</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Donneurs disponibles</Text>
          <Text style={[styles.statValue, { color: theme.colors.success }]}>48</Text>
        </View>
      </View>
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Demandes reçues</Text>
        {requests.map((request) => {
          const urgencyColors = getUrgencyColor(request.urgency);
          return (
            <View key={request.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodType}>{request.bloodType}</Text>
                </View>
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: urgencyColors.bg },
                  ]}
                >
                  <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
                    {request.urgency}
                  </Text>
                </View>
              </View>
              <Text style={styles.hospital}>{request.hospital}</Text>
              <Text style={styles.units}>{request.units} unités requises</Text>
              <Text style={styles.infoText}>{request.requestedBy}</Text>
              <Text style={styles.timeText}>{request.time}</Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => handleSendAlert(request)}
              >
                <Text style={styles.alertButtonText}>Envoyer alerte aux donneurs</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Demandes');
            navigation.navigate('BloodBankDashboard');
          }}
        >
          <Text style={{ fontSize: 24 }}>🔔</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'Demandes' && { color: theme.colors.primary },
            ]}
          >
            Demandes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Historique');
            navigation.navigate('History');
          }}
        >
          <Text style={{ fontSize: 24 }}>⏱️</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'Historique' && { color: theme.colors.primary },
            ]}
          >
            Historique
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab('Profil');
            navigation.navigate('bankprofile');
          }}
        >
          <Text style={{ fontSize: 24 }}>👤</Text>
          <Text
            style={[
              styles.navText,
              activeTab === 'Profil' && { color: theme.colors.primary },
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  content: { flex: 1, backgroundColor: theme.colors.gray50 },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bloodType: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  urgencyBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  urgencyText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  hospital: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  units: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  timeText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray400,
  },
  alertButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  alertButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
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

export default BloodBankDashboard;