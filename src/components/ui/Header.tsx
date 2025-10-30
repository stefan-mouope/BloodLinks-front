import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

// On crée un type simple pour nos props
interface HeaderProps {
  navigation: any;
  route: { name: string };
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

  const isProfilePage =
    route.name === 'doctorprofile' || route.name === 'donorprofile';

  return (
    <View style={styles.container}>
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

          {showCenterTitle && (
            <View style={styles.bottomCenter}>
              <Text style={styles.centerTitle}>BloodLink</Text>
            </View>
          )}

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
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
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
    top: 40,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 40,
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
