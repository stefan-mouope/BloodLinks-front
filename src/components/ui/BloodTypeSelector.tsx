import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { BloodType } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';

interface BloodTypeSelectorProps {
  selectedBloodType: BloodType | null;
  onBloodTypeSelect: (bloodType: BloodType) => void;
  style?: ViewStyle;
}

const BloodTypeSelector: React.FC<BloodTypeSelectorProps> = ({
  selectedBloodType,
  onBloodTypeSelect,
  style,
}) => {
  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const getContainerStyle = (): ViewStyle => {
    return {
      marginBottom: responsiveSize(theme.spacing.md),
      ...style,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.sm),
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.textPrimary,
      marginBottom: responsiveSize(theme.spacing.sm),
    };
  };

  const getGridStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: dynamicWidth(90, 300, 400),
    };
  };

  const getBloodTypeButtonStyle = (isSelected: boolean): ViewStyle => {
    return {
      width: '22%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
      backgroundColor: isSelected ? theme.colors.gray50 : theme.colors.white,
      marginBottom: responsiveSize(theme.spacing.sm),
    };
  };

  const getBloodTypeTextStyle = (isSelected: boolean): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.sm),
      fontWeight: theme.typography.fontWeight.semiBold,
      color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
    };
  };

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle()}>Groupe Sanguin</Text>
      
      <View style={getGridStyle()}>
        {bloodTypes.map((bloodType) => (
          <TouchableOpacity
            key={bloodType}
            style={getBloodTypeButtonStyle(selectedBloodType === bloodType)}
            onPress={() => onBloodTypeSelect(bloodType)}
            activeOpacity={0.7}
          >
            <Text style={getBloodTypeTextStyle(selectedBloodType === bloodType)}>
              {bloodType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BloodTypeSelector;
