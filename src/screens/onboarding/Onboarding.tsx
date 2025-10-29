import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../FirstPage/types';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const swiperRef = useRef<any>(null);

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

  const handleSkip = () => {
    navigation.replace('FirstPage');
  };

  const handleNext = (index: number) => {
    if (index < onboardingData.length - 1) {
      swiperRef.current?.scrollBy(1); // passe à l’étape suivante
    } else {
      navigation.replace('FirstPage'); // dernière étape → FirstPage
    }
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={true}
        dotStyle={styles.progressInactive}
        activeDotStyle={styles.progressActive}
      >
        {onboardingData.map((step, index) => (
          <View key={index} style={styles.slide}>
            {/* Conteneur texte centré */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>

            {/* Conteneur boutons en bas */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.nextButton} onPress={() => handleNext(index)}>
                <Text style={styles.nextButtonText}>
                  {index === onboardingData.length - 1 ? 'Next' : 'Next'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
    width: '80%',
    lineHeight: theme.typography.lineHeight.base,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    height: theme.componentDimensions.buttonHeight.md,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    width: '80%',
  },
  nextButtonText: {
    color: theme.colors.primary,
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
    color: theme.colors.blackcolor,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressActive: {
    width: 20,
    height: 4,
    backgroundColor: theme.colors.white,
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
});

export default OnboardingScreen;
