// components/ui/BottomTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface Tab {
  label: string;
  onPress: () => void;
  active?: boolean;
}

interface BottomTabsProps {
  tabs: Tab[];
}

const BottomTabs: React.FC<BottomTabsProps> = ({ tabs }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => (
        <TouchableOpacity key={idx} style={styles.tab} onPress={tab.onPress}>
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
