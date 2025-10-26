// appNavigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import { RootStackParamList } from '../screens/FirstPage/types.ts';
import FirstPageScreen from '../screens/FirstPage/FirstPageScreen.tsx';
import Header from '../components/ui/Header';
import SignUpScreen from '../screens/Auth/SignUpScreen.tsx';
import DoctorPage from '../screens/DoctorPage/DoctorPage.tsx';
import CreateRequestScreen from '../screens/DoctorPage/CreateRequestScreen.tsx';
import BloodBankDashboard from '../screens/BloodBank/BloodBankDashboard.tsx';
import DonorDashboard from '../screens/DonneurPage/DonorDashboard.tsx';
import DoctorProfileScreen from '../screens/profiles/DoctorProfileScreen.tsx';
import DonorProfileScreen from '../screens/profiles/DonorProfileScreen.tsx';
import BankProfileScreen from '../screens/profiles/BankProfileScreen.tsx';

const Stack = createStackNavigator<RootStackParamList>();
const myOnSubmitFunction = (data: any) => {
    // Ici, tu gères la soumission du formulaire d'inscription
    console.log('SignUp data:', data);
  };


const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <Header {...props} />, 
          headerShown: true, 
        }}
        initialRouteName="FirstPage"
      >
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
        <Stack.Screen 
          name="SignUp" 
          children={() => <SignUpScreen onSubmit={myOnSubmitFunction} />} 
        />
        <Stack.Screen
        name="DoctorPage"
        component={DoctorPage}
      />
        <Stack.Screen
          name="CreateRequest"
          component={CreateRequestScreen}
        />

        <Stack.Screen
          name="bloodbank"
          component={BloodBankDashboard}
        />

        <Stack.Screen
          name="donor"
          component={DonorDashboard }
        />

       <Stack.Screen
          name="donorprofile"
          component={ DonorProfileScreen}
        />

       <Stack.Screen
          name="doctorprofile"
          component={ DoctorProfileScreen}
        />
       <Stack.Screen
          name="bankprofile"
          component={ BankProfileScreen}
        />







      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;