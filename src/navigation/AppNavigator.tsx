import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import useAuthStore from '../store/authStore';

// Écrans
import LoginScreen from '../screens/Auth/LoginScreen';
import FirstPageScreen from '../screens/FirstPage/FirstPageScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import Header from '../components/ui/Header';

// Types de navigation
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  FirstPage: undefined;
  // Ajoutez d'autres écrans ici
};

const Stack = createStackNavigator<RootStackParamList>();

// Écran de chargement
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

// Stack pour l'authentification
const AuthStack = () => (
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
      options={{ title: 'Accueil' }} 
    />
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={{ title: 'Connexion' }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        title: 'Créer un compte',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

// Stack principal
const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      header: (props) => <Header {...props} />,
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="FirstPage" 
      component={FirstPageScreen} 
      options={{ title: 'Accueil' }} 
    />
  </Stack.Navigator>
);

// Navigateur principal
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;