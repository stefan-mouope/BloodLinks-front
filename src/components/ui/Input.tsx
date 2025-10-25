import React from 'react';
import {
  View,
  Text,
  TextInput,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { theme } from '../../constants/theme';
import { InputProps } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  size = 'md',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
}) => {
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
      marginBottom: responsiveSize(theme.spacing.xs),
      ...labelStyle,
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: responsiveSize(theme.spacing.md),
      backgroundColor: disabled ? theme.colors.gray100 : theme.colors.white,
      fontSize: responsiveFontSize(theme.typography.fontSize.base),
      color: theme.colors.textPrimary,
      width: dynamicWidth(90, 280, 400),
    };

    const sizeStyles: Record<InputSize, TextStyle> = {
      sm: {
        height: theme.componentDimensions.inputHeight.sm,
        paddingVertical: responsiveSize(theme.spacing.xs),
      },
      md: {
        height: theme.componentDimensions.inputHeight.md,
        paddingVertical: responsiveSize(theme.spacing.sm),
      },
      lg: {
        height: theme.componentDimensions.inputHeight.lg,
        paddingVertical: responsiveSize(theme.spacing.md),
      },
    };

    const multilineStyle: TextStyle = multiline
      ? {
          height: 'auto',
          minHeight: theme.componentDimensions.inputHeight[size],
          textAlignVertical: 'top',
        }
      : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...multilineStyle,
      ...inputStyle,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: responsiveFontSize(theme.typography.fontSize.xs),
      color: theme.colors.error,
      marginTop: responsiveSize(theme.spacing.xs),
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <TextInput
        style={getInputStyle()}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textContentType={secureTextEntry ? 'password' : 'none'}
        autoCorrect={false}
      />
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};

export default Input;
