import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { RoleSelectorProps, RoleType } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';
import RoleCard from './RoleCard';

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  style,
}) => {
  const roles: Array<{ type: RoleType; title: string }> = [
    { type: 'docteur', title: 'Docteur' },
    { type: 'banque', title: 'Banque de Sang' },
    { type: 'donneur', title: 'Donneur' },
  ];

  const getContainerStyle = (): ViewStyle => ({
    marginBottom: responsiveSize(theme.spacing.lg),
    ...style,
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: responsiveFontSize(theme.typography.fontSize.base),
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: responsiveSize(theme.spacing.md),
    textAlign: 'left' as const, // Typage explicite pour éviter les erreurs
  });

  const getRolesContainerStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: dynamicWidth(90, 300, 400), // Ajustement basé sur la taille de l'écran
  });

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle()}>Sélectionnez votre rôle</Text> {/* Changé en français */}
      <View style={getRolesContainerStyle()}>
        {roles.map((role) => (
          <RoleCard
            key={role.type}
            role={role.type}
            title={role.title}
            isSelected={selectedRole === role.type}
            onPress={() => onRoleSelect(role.type)}
          />
        ))}
      </View>
    </View>
  );
};

export default RoleSelector;