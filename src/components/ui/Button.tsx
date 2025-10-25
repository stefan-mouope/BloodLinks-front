import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../constants/theme';
import { ButtonProps } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth } from '../../utils/responsive';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: responsiveSize(theme.spacing.lg),
      height: theme.componentDimensions.buttonHeight[size],
      opacity: disabled ? 0.6 : 1,
    };

    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: {
        paddingHorizontal: responsiveSize(theme.spacing.md),
        height: theme.componentDimensions.buttonHeight.sm,
      },
      md: {
        paddingHorizontal: responsiveSize(theme.spacing.lg),
        height: theme.componentDimensions.buttonHeight.md,
      },
      lg: {
        paddingHorizontal: responsiveSize(theme.spacing.xl),
        height: theme.componentDimensions.buttonHeight.lg,
      },
    };

    const widthStyle: ViewStyle = fullWidth
      ? { width: dynamicWidth(90, 280, 400) }
      : {};

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...widthStyle,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: responsiveFontSize(theme.typography.fontSize.base),
      fontWeight: theme.typography.fontWeight.semiBold,
      textAlign: 'center',
    };

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: theme.colors.white,
      },
      secondary: {
        color: theme.colors.white,
      },
      outline: {
        color: theme.colors.primary,
      },
      ghost: {
        color: theme.colors.primary,
      },
    };

    const sizeTextStyles: Record<ButtonSize, TextStyle> = {
      sm: {
        fontSize: responsiveFontSize(theme.typography.fontSize.sm),
      },
      md: {
        fontSize: responsiveFontSize(theme.typography.fontSize.base),
      },
      lg: {
        fontSize: responsiveFontSize(theme.typography.fontSize.lg),
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : theme.colors.white
          }
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
