import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 12 Pro as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Get responsive width based on screen width
 * @param size - Size in percentage (0-100) or fixed pixels
 * @returns Responsive width value
 */
export const wp = (size: number): number => {
  const percentage = size / 100;
  return SCREEN_WIDTH * percentage;
};

/**
 * Get responsive height based on screen height
 * @param size - Size in percentage (0-100) or fixed pixels
 * @returns Responsive height value
 */
export const hp = (size: number): number => {
  const percentage = size / 100;
  return SCREEN_HEIGHT * percentage;
};

/**
 * Scale font size based on screen width
 * @param size - Font size to scale
 * @returns Scaled font size
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scale dimensions based on screen width
 * @param size - Size to scale
 * @returns Scaled size
 */
export const scaleSize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

/**
 * Get responsive padding/margin based on screen size
 * @param baseSize - Base size for small screens
 * @param scaleFactor - Factor to scale for larger screens
 * @returns Responsive size
 */
export const responsiveSize = (baseSize: number, scaleFactor: number = 1.2): number => {
  if (SCREEN_WIDTH < 375) {
    return baseSize;
  } else if (SCREEN_WIDTH < 414) {
    return baseSize * scaleFactor;
  } else {
    return baseSize * scaleFactor * 1.1;
  }
};

/**
 * Get responsive font size based on screen size
 * @param baseSize - Base font size
 * @returns Responsive font size
 */
export const responsiveFontSize = (baseSize: number): number => {
  if (SCREEN_WIDTH < 375) {
    return baseSize * 0.9;
  } else if (SCREEN_WIDTH < 414) {
    return baseSize;
  } else {
    return baseSize * 1.1;
  }
};

/**
 * Check if device is small screen
 */
export const isSmallScreen = (): boolean => SCREEN_WIDTH < 375;

/**
 * Check if device is medium screen
 */
export const isMediumScreen = (): boolean => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

/**
 * Check if device is large screen
 */
export const isLargeScreen = (): boolean => SCREEN_WIDTH >= 414;

/**
 * Get responsive spacing based on screen size
 * @param baseSpacing - Base spacing value
 * @returns Responsive spacing
 */
export const responsiveSpacing = (baseSpacing: number): number => {
  if (isSmallScreen()) {
    return baseSpacing * 0.8;
  } else if (isLargeScreen()) {
    return baseSpacing * 1.2;
  }
  return baseSpacing;
};

/**
 * Get responsive border radius based on screen size
 * @param baseRadius - Base border radius
 * @returns Responsive border radius
 */
export const responsiveBorderRadius = (baseRadius: number): number => {
  if (isSmallScreen()) {
    return baseRadius * 0.8;
  } else if (isLargeScreen()) {
    return baseRadius * 1.2;
  }
  return baseRadius;
};

/**
 * Calculate dynamic width for components
 * @param percentage - Percentage of screen width (0-100)
 * @param minWidth - Minimum width
 * @param maxWidth - Maximum width
 * @returns Calculated width
 */
export const dynamicWidth = (
  percentage: number,
  minWidth?: number,
  maxWidth?: number
): number => {
  let width = wp(percentage);
  
  if (minWidth && width < minWidth) {
    width = minWidth;
  }
  
  if (maxWidth && width > maxWidth) {
    width = maxWidth;
  }
  
  return width;
};

/**
 * Calculate dynamic height for components
 * @param percentage - Percentage of screen height (0-100)
 * @param minHeight - Minimum height
 * @param maxHeight - Maximum height
 * @returns Calculated height
 */
export const dynamicHeight = (
  percentage: number,
  minHeight?: number,
  maxHeight?: number
): number => {
  let height = hp(percentage);
  
  if (minHeight && height < minHeight) {
    height = minHeight;
  }
  
  if (maxHeight && height > maxHeight) {
    height = maxHeight;
  }
  
  return height;
};

/**
 * Get safe area padding for different screen sizes
 * @param basePadding - Base padding value
 * @returns Safe area responsive padding
 */
export const safeAreaPadding = (basePadding: number): number => {
  if (isSmallScreen()) {
    return basePadding * 0.7;
  } else if (isLargeScreen()) {
    return basePadding * 1.3;
  }
  return basePadding;
};

export default {
  wp,
  hp,
  scaleFontSize,
  scaleSize,
  responsiveSize,
  responsiveFontSize,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  responsiveSpacing,
  responsiveBorderRadius,
  dynamicWidth,
  dynamicHeight,
  safeAreaPadding,
};
