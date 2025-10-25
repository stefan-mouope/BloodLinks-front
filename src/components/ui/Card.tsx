import React from 'react';
import { View, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';
import { CardProps } from '../../types';
import { responsiveSize, responsiveBorderRadius } from '../../utils/responsive';

const Card: React.FC<CardProps> = ({
  children,
  padding = theme.componentDimensions.cardPadding,
  margin = 0,
  borderRadius = theme.borderRadius.lg,
  shadow = 'sm',
  backgroundColor = theme.colors.white,
  borderColor = theme.colors.border,
  borderWidth = 0,
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor,
      borderRadius: responsiveBorderRadius(borderRadius),
      padding: responsiveSize(padding),
      margin: responsiveSize(margin),
      borderWidth,
      borderColor,
    };

    const shadowStyle: ViewStyle = shadow !== 'none' ? theme.shadows[shadow] : {};

    return {
      ...baseStyle,
      ...shadowStyle,
      ...style,
    };
  };

  return <View style={getCardStyle()}>{children}</View>;
};

export default Card;
