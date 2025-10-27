import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../constants/theme';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {RootStackParamList} from "../FirstPage/types"


type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};


const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Onboarding'>>();
  const step = route.params?.step ?? 1;

  const onboardingData = [
    {
      title: 'Doctors Create Blood Requests',
      description: 'Healthcare professionals can quickly request blood for their patients with just a few taps',
    },
    {
      title: 'Banks Notify Donors',
      description: 'Blood banks instantly connect with compatible donors in their network.',
    },
    {
      title: 'Donors Save Lives',
      description: 'Be a hero. Your donation can save a life in your community.',
    },
  ];

  const currentStep = onboardingData[step - 1];
  const totalSteps = onboardingData.length;

  const handleNext = () => {
    if (step < totalSteps) {
      navigation.replace('Onboarding', { step: step + 1 });
    }else{
        navigation.replace('FirstPage');
    }
  };

  const handleSkip = () => {
    navigation.replace('FirstPage');
  };

  return (
    <View style={styles.container}>
      {/* Conteneur pour le contenu principal (titre et description) */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {currentStep.description}
        </Text>
      </View>
      {/* Conteneur pour le bloc en bas */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressBarContainer}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={index + 1 <= step ? styles.progressActive : styles.progressInactive}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        //   disabled={step === totalSteps}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Positionne le contenu en haut
    alignItems: 'center',
    paddingTop: theme.spacing.xl, // Espacement supplémentaire en haut pour remonter
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
    description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    width: '80%', // Limite la largeur pour forcer trois lignes
    lineHeight: theme.typography.lineHeight.base, // Ajuste la hauteur des lignes
    },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  progressActive: {
    width: 20,
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: 4,
  },
  progressInactive: {
    width: 4,
    height: 4,
    backgroundColor: theme.colors.gray300,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    height: theme.componentDimensions.buttonHeight.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    width: '80%',
  },
  nextButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  skipButton: {
    paddingHorizontal: theme.spacing.md,
    height: theme.componentDimensions.buttonHeight.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
  },
});

export default OnboardingScreen;