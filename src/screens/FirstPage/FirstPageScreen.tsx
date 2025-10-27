import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; 

// Typage de la navigation
type FirstPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FirstPage'>;

const FirstPageScreen = () => {
  const navigation = useNavigation<FirstPageScreenNavigationProp>();

  const handleStart = () => {
    navigation.navigate('Login');
  };

 const handleBackToOnboarding = () => {
    navigation.navigate('Onboarding', { step: 3 }); // dernier step
  };

  return (
    <View style={styles.container}>
      {/* Bouton Back */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackToOnboarding}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>BloodLink</Text>
      <Text style={styles.subtitle}>Donner du sang, sauver des vies.</Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Commencer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.white,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.white,
    marginVertical: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default FirstPageScreen;