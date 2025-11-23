import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../constants/theme';
import { responsiveFontSize, responsiveSize } from '../../utils/responsive';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Forme de goutte de sang en arrière-plan */}
      <View style={styles.bloodDropBackground}>
        <Svg height="100%" width="100%" viewBox="0 0 100 120" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={theme.colors.primaryLight} stopOpacity="0.95" />
              <Stop offset="50%" stopColor={theme.colors.primary} stopOpacity="0.95" />
              <Stop offset="100%" stopColor={theme.colors.primaryDark} stopOpacity="0.95" />
            </LinearGradient>
          </Defs>
          {/* Forme de goutte de sang stylisée */}
          <Path
            d="M 50 10 
               C 35 25, 20 40, 20 60
               C 20 75, 32 90, 50 90
               C 68 90, 80 75, 80 60
               C 80 40, 65 25, 50 10 Z
               M 30 50
               C 30 55, 32 58, 35 58
               C 38 58, 40 55, 40 50
               C 40 48, 38 46, 35 46
               C 32 46, 30 48, 30 50 Z"
            fill="url(#grad)"
          />
          {/* Ondulations sur les côtés pour effet liquide */}
          <Path
            d="M 15 55 Q 10 60, 15 65 Q 20 70, 15 75 Q 10 80, 15 85"
            fill="none"
            stroke={theme.colors.primaryLight}
            strokeWidth="2"
            opacity="0.4"
          />
          <Path
            d="M 85 55 Q 90 60, 85 65 Q 80 70, 85 75 Q 90 80, 85 85"
            fill="none"
            stroke={theme.colors.primaryLight}
            strokeWidth="2"
            opacity="0.4"
          />
        </Svg>
      </View>

      {/* Bouton retour */}
      {/* {showBackButton && onBackPress && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonText}>←</Text>
          </View>
        </TouchableOpacity>
      )} */}
      
      {/* Contenu du header */}
      <View style={styles.contentContainer}>
        {/* Icône de goutte de sang miniature */}
        <View style={styles.iconContainer}>
          <Svg height="40" width="30" viewBox="0 0 100 120">
            <Path
              d="M 50 10 
                 C 35 25, 20 40, 20 60
                 C 20 75, 32 90, 50 90
                 C 68 90, 80 75, 80 60
                 C 80 40, 65 25, 50 10 Z"
              fill={theme.colors.white}
              opacity="0.9"
            />
          </Svg>
        </View>
        
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        
        {/* Petite croix médicale en bas */}
        <View style={styles.crossContainer}>
          <View style={styles.crossHorizontal} />
          <View style={styles.crossVertical} />
        </View>
      </View>

      {/* Effet d'ondulation en bas */}
      <View style={styles.waveContainer}>
        <Svg height="30" width="100%" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <Path
            d="M 0 20 Q 150 40, 300 20 Q 450 0, 600 20 Q 750 40, 900 20 Q 1050 0, 1200 20 L 1200 60 L 0 60 Z"
            fill="#FFFFFF"
            opacity="0.1"
          />
          <Path
            d="M 0 30 Q 150 50, 300 30 Q 450 10, 600 30 Q 750 50, 900 30 Q 1050 10, 1200 30 L 1200 60 L 0 60 Z"
            fill="#FFFFFF"
            opacity="0.05"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: responsiveSize(theme.spacing.md),
    paddingBottom: responsiveSize(theme.spacing.sm),
    position: 'relative',
    overflow: 'hidden',
    minHeight: responsiveSize(160),
  },
  bloodDropBackground: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 200,
    opacity: 0.9,
  },
  backButton: {
    position: 'absolute',
    top: responsiveSize(theme.spacing.md),
    left: responsiveSize(theme.spacing.sm),
    zIndex: 10,
  },
  backButtonCircle: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  backButtonText: {
    fontSize: responsiveFontSize(24),
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveSize(theme.spacing.xl),
    paddingTop: responsiveSize(theme.spacing.xl),
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: responsiveSize(theme.spacing.sm),
  },
  title: {
    fontSize: responsiveFontSize(theme.typography.fontSize['3xl']),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: responsiveSize(theme.spacing.xs),
    textAlign: 'center',
    textShadowColor: theme.colors.primaryDark,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: responsiveFontSize(theme.typography.fontSize.base),
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: responsiveSize(theme.spacing.lg),
    opacity: 0.95,
    textShadowColor: theme.colors.primaryDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  crossContainer: {
    marginTop: responsiveSize(theme.spacing.md),
    width: responsiveSize(24),
    height: responsiveSize(24),
    position: 'relative',
  },
  crossHorizontal: {
    position: 'absolute',
    width: responsiveSize(24),
    height: responsiveSize(7),
    backgroundColor: theme.colors.primary,
    top: responsiveSize(8.5),
    opacity: 0.9,
    borderRadius: responsiveSize(2),
  },
  crossVertical: {
    position: 'absolute',
    width: responsiveSize(7),
    height: responsiveSize(24),
    backgroundColor: theme.colors.primary,
    left: responsiveSize(8.5),
    opacity: 0.9,
    borderRadius: responsiveSize(2),
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
});

export default Header;
