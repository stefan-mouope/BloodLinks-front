import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { theme } from '../../constants/theme';

interface HeaderProps extends StackHeaderProps {
  notificationCount?: number;
  centerSubtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  navigation,
  route,
  notificationCount = 0,
  centerSubtitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const showBackButton = route.name !== 'FirstPage';
  const showCenterTitle = route.name === 'Login' || route.name === 'SignUp';
  const showRightIcons =
    route.name === 'DoctorPage' ||
    route.name === 'bloodbank' ||
    route.name === 'donor';

  const getLeftTitle = () => {
    switch (route.name) {
      case 'Login':
        return 'Login';
      case 'SignUp':
        return 'Register';
      case 'DoctorPage':
        return 'DoctorPage';
      case 'Profile':
        return 'Profil';
      case 'Home':
        return 'Accueil';
      case 'bloodbank':
        return 'Banque de sang';
      case 'donor':
        return 'Mes alertes';
      case 'doctorprofile':
      case 'donorprofile':
        return 'Mon profil';
      default:
        return route.name;
    }
  };

  // Cas spécial : DoctorProfile et DonorProfile
  const isProfilePage =
    route.name === 'doctorprofile' || route.name === 'donorprofile';

  return (
    <View style={styles.container}>
      {/* === Cas spécial : Pages profil (Doctor / Donor) === */}
      {isProfilePage ? (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.icon}>⬅️</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mon profil</Text>

          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.icon}>{isEditing ? '✅' : '✏️'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* === Bouton retour pour les autres pages === */}
          {showBackButton && (
            <View style={styles.topLeft}>
              <TouchableOpacity
                style={styles.backContainer}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backArrow}>{'←'}</Text>
                <Text style={styles.backText}>{getLeftTitle()}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* === Titre centré pour Login / SignUp === */}
          {showCenterTitle && (
            <View style={styles.bottomCenter}>
              <Text style={styles.centerTitle}>BloodLink</Text>
            </View>
          )}

          {/* === Icônes à droite pour Donor / BloodBank / Doctor === */}
          {showRightIcons && (
            <View style={styles.topRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.icon}>🔔</Text>
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.icon}>👤</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* === Sous-titre pour DonorDashboard === */}
          {route.name === 'DonorDashboard' && centerSubtitle && (
            <View style={styles.bottomSubtitle}>
              <Text style={styles.subtitle}>{centerSubtitle}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    height: 120,
    position: 'relative',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  icon: {
    fontSize: 20,
    color: theme.colors.white,
  },
  topLeft: {
    position: 'absolute',
    top: 25,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 25,
    right: 12,
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    color: theme.colors.white,
    fontSize: 18,
    marginRight: 4,
  },
  backText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bottomCenter: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomSubtitle: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  centerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    opacity: 0.9,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FBBF24',
    borderRadius: theme.borderRadius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default Header;
