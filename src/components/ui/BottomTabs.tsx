// components/ui/BottomTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';

type UserRole = 'doctor' | 'bank' | 'donor';

interface Tab {
  label: string;
  onPress?: () => void;
  active?: boolean;
}

interface BottomTabsProps {
  tabs: Tab[];
  userRole: UserRole;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ tabs, userRole }) => {
  const navigation = useNavigation<any>();

  const handlePress = (label: string, onPress?: () => void) => {
    if (label === 'Profil') {
      // Naviguer vers l'écran de profil correspondant au rôle
      const profileScreen = {
        doctor: 'DoctorProfile',
        bank: 'BankProfile',
        donor: 'DonorProfile',
      }[userRole];
      navigation.navigate(profileScreen);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.tab}
          onPress={() => handlePress(tab.label, tab.onPress)}
        >
          <Text style={[styles.label, tab.active && { color: theme.colors.primary }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
  },
  tab: { alignItems: 'center' },
  label: { fontSize: theme.typography.fontSize.xs, color: theme.colors.textSecondary },
});

export default BottomTabs;