import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { BankData } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';

interface BankSelectorProps {
  selectedBankId: number | null;
  onBankSelect: (bankId: number) => void;
  style?: ViewStyle;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  selectedBankId,
  onBankSelect,
  style,
}) => {
  // Mock data - En production, cela viendrait de votre API
  const [banks] = useState<BankData[]>([
    { id: 1, nom: 'Banque de Sang Central', localisation: 'Casablanca' },
    { id: 2, nom: 'Centre de Transfusion', localisation: 'Rabat' },
    { id: 3, nom: 'Banque de Sang Régional', localisation: 'Marrakech' },
    { id: 4, nom: 'Centre Hématologique', localisation: 'Fès' },
    { id: 5, nom: 'Banque de Sang Universitaire', localisation: 'Agadir' },
  ]);

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

  const getBankItemStyle = (isSelected: boolean): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      padding: responsiveSize(theme.spacing.md),
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
      backgroundColor: isSelected ? theme.colors.gray50 : theme.colors.white,
      marginBottom: responsiveSize(theme.spacing.sm),
      width: dynamicWidth(90, 300, 400),
    };
  };

  const getBankTextStyle = (isSelected: boolean): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.base),
      fontWeight: theme.typography.fontWeight.medium,
      color: isSelected ? theme.colors.primary : theme.colors.textPrimary,
    };
  };

  const getLocationTextStyle = (isSelected: boolean): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.sm),
      color: isSelected ? theme.colors.primary : theme.colors.textSecondary,
      marginTop: responsiveSize(theme.spacing.xs),
    };
  };

  const getBankInfoStyle = (): ViewStyle => {
    return {
      flex: 1,
      marginLeft: responsiveSize(theme.spacing.sm),
    };
  };

  return (
    <View style={getContainerStyle()}>
      <Text style={getLabelStyle()}>Banque de Sang</Text>
      
      {banks.map((bank) => (
        <TouchableOpacity
          key={bank.id}
          style={getBankItemStyle(selectedBankId === bank.id)}
          onPress={() => onBankSelect(bank.id)}
          activeOpacity={0.7}
        >
          <View style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: selectedBankId === bank.id ? theme.colors.primary : theme.colors.border,
            marginRight: responsiveSize(theme.spacing.sm),
          }} />
          
          <View style={getBankInfoStyle()}>
            <Text style={getBankTextStyle(selectedBankId === bank.id)}>
              {bank.nom}
            </Text>
            <Text style={getLocationTextStyle(selectedBankId === bank.id)}>
              {bank.localisation}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BankSelector;
