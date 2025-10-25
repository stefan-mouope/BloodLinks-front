import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { RoleCardProps, RoleType } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';

// Simple icon components (you can replace these with actual icon libraries)
const DoctorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Text style={{ color: 'white', fontSize: size * 0.5, fontWeight: 'bold' }}>D</Text>
  </View>
);

const BloodDropIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 4,
    transform: [{ rotate: '45deg' }],
  }} />
);

const HeartIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <Text style={{ color: 'white', fontSize: size * 0.4 }}>♥</Text>
  </View>
);

const getRoleIcon = (role: RoleType, size: number, color: string) => {
  switch (role) {
    case 'docteur':
      return <DoctorIcon size={size} color={color} />;
    case 'banque':
      return <BloodDropIcon size={size} color={color} />;
    case 'donneur':
      return <HeartIcon size={size} color={color} />;
    default:
      return null;
  }
};

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  icon,
  isSelected,
  onPress,
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: responsiveSize(theme.spacing.md),
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      minHeight: theme.componentDimensions.cardMinHeight,
      marginHorizontal: responsiveSize(theme.spacing.xs),
    };

    const selectedStyle: ViewStyle = isSelected
      ? {
          borderColor: theme.colors.primary,
          backgroundColor: theme.colors.gray50,
        }
      : {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.white,
        };

    return {
      ...baseStyle,
      ...selectedStyle,
      ...style,
    };
  };

  const getTitleStyle = (): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.sm),
      fontWeight: theme.typography.fontWeight.medium,
      color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
      marginTop: responsiveSize(theme.spacing.sm),
      textAlign: 'center',
    };
  };

  const iconSize = theme.componentDimensions.iconSize.lg;
  const iconColor = isSelected ? theme.colors.primary : theme.colors.gray400;

  return (
    <TouchableOpacity
      style={getCardStyle()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon || getRoleIcon(role, iconSize, iconColor)}
      <Text style={getTitleStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RoleCard;
