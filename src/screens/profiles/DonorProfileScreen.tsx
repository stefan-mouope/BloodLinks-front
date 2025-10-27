// screens/DonorProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { theme } from '../../constants/theme';

interface ProfileProps {
  navigation: any;
}

const DonorProfileScreen = ({ navigation }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const profileData = {
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+237 677 345 678',
    location: 'Yaoundé, Cameroun',
    bloodType: 'A+',
    dateOfBirth: '15/03/1990',
    weight: '75 kg',
    lastDonation: '15 Sept 2025',
  };

  const donationHistory = [
    { id: '1', date: '15 Sept 2025', location: 'Hôpital Central', status: 'Complété' },
    { id: '2', date: '20 Juil 2025', location: 'Clinique Nord', status: 'Complété' },
    { id: '3', date: '05 Mai 2025', location: 'Hôpital Sud', status: 'Complété' },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>🩺</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.avatarEditButton}>
                <Text style={styles.icon}>📸</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <View style={styles.bloodTypeBadge}>
            <Text style={styles.icon}>🩺</Text>
            <Text style={styles.bloodTypeText}>Groupe sanguin: {profileData.bloodType}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations personnelles</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text style={styles.icon}>✉️</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={profileData.email}
                placeholder="Email"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.infoText}>{profileData.email}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text style={styles.icon}>📞</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={profileData.phone}
                placeholder="Téléphone"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoText}>{profileData.phone}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text style={styles.icon}>📍</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={profileData.location}
                placeholder="Adresse"
              />
            ) : (
              <Text style={styles.infoText}>{profileData.location}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text style={styles.icon}>🎂</Text>
            </View>
            <Text style={styles.infoText}>Né(e) le {profileData.dateOfBirth}</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Text style={styles.icon}>⚖️</Text>
            </View>
            <Text style={styles.infoText}>Poids: {profileData.weight}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Historique des dons</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {donationHistory.slice(0, 3).map((donation) => (
            <View key={donation.id} style={styles.historyItem}>
              <View style={styles.historyIcon}>
                <Text style={styles.icon}>🩺</Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>{donation.date}</Text>
                <Text style={styles.historyLocation}>{donation.location}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.icon}>✅</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.icon}>🩺</Text>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Dons totaux</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.icon}>❤️</Text>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Vies sauvées</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.icon}>🏆</Text>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Niveau</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paramètres</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.icon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.icon}>➡️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={styles.settingText}>Sécurité et confidentialité</Text>
            <Text style={styles.icon}>➡️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.icon}>❓</Text>
            <Text style={styles.settingText}>Aide et support</Text>
            <Text style={styles.icon}>➡️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.icon}>ℹ️</Text>
            <Text style={styles.settingText}>À propos</Text>
            <Text style={styles.icon}>➡️</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.icon}>🚪</Text>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
        <View style={{ height: theme.spacing.xl }} />
      </ScrollView>
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🚪</Text>
            <Text style={styles.modalTitle}>Se déconnecter?</Text>
            <Text style={styles.modalText}>
              Êtes-vous sûr de vouloir vous déconnecter de votre compte?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonTextConfirm}>Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.gray50,
  },
  profileSection: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatarIcon: {
    fontSize: 48,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  profileName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  bloodTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  bloodTypeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.primary,
  },
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  infoIcon: {
    width: 40,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
  },
  infoInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  historyLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    padding: theme.spacing.xs,
  },
  statsCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...theme.shadows.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  settingText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.error,
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.error,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  modalIcon: {
    fontSize: 48,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.gray200,
    alignItems: 'center',
  },
  modalButtonTextCancel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.textPrimary,
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
  },
  modalButtonTextConfirm: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.white,
  },
});

export default DonorProfileScreen;