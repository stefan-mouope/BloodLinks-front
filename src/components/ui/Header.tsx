import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { theme } from '../../constants/theme';

const Header: React.FC<StackHeaderProps> = ({ navigation, route }) => {
  const showBackButton = route.name !== 'FirstPage';

  const getLeftTitle = () => {
    switch (route.name) {
      case 'Login':
        return 'Login';
      case 'SignUp':
        return 'Register';
      case 'Home':
        return 'Accueil';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.bottomCenter}>
        <Text style={styles.centerTitle}>BloodLink</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    height: 120,
    position: 'relative',
  },
  topLeft: {
    position: 'absolute',
    top: 10,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default Header;
