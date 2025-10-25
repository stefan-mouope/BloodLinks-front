import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../../constants/theme';

export const FirstPageScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BloodLink</Text>
      <Text style={styles.subtitle}>Sauver des vies, une goutte à la fois</Text>
      <TouchableOpacity style={styles.button}>
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
