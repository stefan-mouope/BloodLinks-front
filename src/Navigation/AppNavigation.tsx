import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import useAuthStore from '../store/authStore';

import { RootStackParamList } from '../screens/FirstPage/types.ts';
import Header from '../components/ui/Header';
import useNotification from '../firabase/useNotification';

// Auth & Onboarding
import OnboardingScreen from '../screens/onboarding/Onboarding.tsx';
import FirstPageScreen from '../screens/FirstPage/FirstPageScreen.tsx';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen.tsx';

// Dashboards
import DoctorPage from '../screens/DoctorPage/DoctorPage.tsx';
import CreateRequestScreen from '../screens/DoctorPage/CreateRequestScreen.tsx';
import BloodBankDashboard from '../screens/BloodBank/BloodBankDashboard.tsx';
import DonorDashboard from '../screens/DonneurPage/DonorDashboard.tsx';

// Profiles
import DoctorProfileScreen from '../screens/profiles/DoctorProfileScreen.tsx';
import DonorProfileScreen from '../screens/profiles/DonorProfileScreen.tsx';
import BankProfileScreen from '../screens/profiles/BankProfileScreen.tsx';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();

  // Initialiser les notifications pour l'utilisateur connecté
  useNotification(user?.id || null);

  // Vérifie l'état d'authentification au montage
  useEffect(() => {
    checkAuth();
  }, []);

  // Pendant le chargement, on affiche un petit loader
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Header {...props} />,
          headerShown: true,
        }}
      >
        {/* 🔹 Si utilisateur connecté */}
        {isAuthenticated && user ? (
          <>
            {user.user_type === 'docteur' && (
              <>
                <Stack.Screen
                  name="DoctorPage"
                  component={DoctorPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="doctorprofile" component={DoctorProfileScreen} />
                <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
              </>
            )}

            {user.user_type === 'banque' && (
              <>
                <Stack.Screen
                  name="bloodbank"
                  component={BloodBankDashboard}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="bankprofile" component={BankProfileScreen} />
              </>
            )}

            {user.user_type === 'donneur' && (
              <>
                <Stack.Screen
                  name="donor"
                  component={DonorDashboard}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="donorprofile" component={DonorProfileScreen} />
              </>
            )}
          </>
        ) : (
          // 🔹 Sinon (utilisateur non connecté)
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              initialParams={{ step: 1 }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FirstPage"
              component={FirstPageScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'BloodLink' }}
            />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
