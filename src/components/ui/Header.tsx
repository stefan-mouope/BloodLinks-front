import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { theme } from '../../constants/theme';

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
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={theme.colors.primary}
        translucent={false}
      />
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
          <View style={styles.contentWrapper}>
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
          </View>
        )}
      </View>
    </>
  );
};

const HEADER_HEIGHT = 100;
const SAFE_PADDING_TOP = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    height: HEADER_HEIGHT,
    paddingTop: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  backButton: {
    padding: theme.spacing.sm,
    minWidth: 40,
  },
  editButton: {
    padding: theme.spacing.sm,
    minWidth: 40,
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  icon: {
    fontSize: 22,
    color: theme.colors.white,
  },
  topLeft: {
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backArrow: {
    color: theme.colors.white,
    fontSize: 20,
    marginRight: 6,
    fontWeight: 'bold',
  },
  backText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  bottomCenter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 16,
  },
  bottomSubtitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  centerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    opacity: 0.95,
    fontWeight: theme.typography.fontWeight.medium,
  },
  iconButton: {
    padding: theme.spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FBBF24',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default Header