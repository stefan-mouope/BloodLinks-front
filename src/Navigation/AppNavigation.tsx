// AppNavigation.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import useAuthStore from '../store/authStore';

import DoctorPage from '../screens/DoctorPage/DoctorPage';
import DoctorProfileScreen from '../screens/profiles/DoctorProfileScreen';
import CreateRequestScreen from '../screens/DoctorPage/CreateRequestScreen';

import DonorDashboard from '../screens/DonneurPage/DonorDashboard';
import DonorProfileScreen from '../screens/profiles/DonorProfileScreen';

import BloodBankDashboard from '../screens/BloodBank/BloodBankDashboard';
import BankProfileScreen from '../screens/profiles/BankProfileScreen';

import OnboardingScreen from '../screens/onboarding/Onboarding';
import FirstPageScreen from '../screens/FirstPage/FirstPageScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Bottom Tabs par type d'utilisateur ───
const DoctorTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="DoctorHome"
      component={DoctorPage}
      options={{ tabBarLabel: 'Accueil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
    />
    <Tab.Screen
      name="DoctorProfile"
      component={DoctorProfileScreen}
      options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
    />
  </Tab.Navigator>
);

const DonorTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="DonorHome"
      component={DonorDashboard}
      options={{ tabBarLabel: 'Accueil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
    />
    <Tab.Screen
      name="DonorProfile"
      component={DonorProfileScreen}
      options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
    />
  </Tab.Navigator>
);

const BankTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="BankHome"
      component={BloodBankDashboard}
      options={{ tabBarLabel: 'Accueil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text> }}
    />
    <Tab.Screen
      name="BankProfile"
      component={BankProfileScreen}
      options={{ tabBarLabel: 'Profil', tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text> }}
    />
  </Tab.Navigator>
);

// ─── Stack principal dynamique ───
const AppStack = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen}/>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="FirstPage" component={FirstPageScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name='Home' component={user?.user_type === 'docteur' ? DoctorTabs : user?.user_type === 'donneur' ? DonorTabs : user?.user_type === 'banque' ? BankTabs : LoginScreen} />
        {/* {!isAuthenticated || !user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="FirstPage" component={FirstPageScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : user.user_type === 'docteur' ? (
          <>
            <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
            <Stack.Screen name="CreateRequest" component={CreateRequestScreen} />
          </>
        ) : user.user_type === 'donneur' ? (
          <Stack.Screen name="DonorTabs" component={DonorTabs} />
        ) : user.user_type === 'banque' ? (
          <Stack.Screen name="BankTabs" component={BankTabs} />
        ) : null} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
