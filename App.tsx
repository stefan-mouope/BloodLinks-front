
import React from 'react';
import { FirstPageScreen } from './src/components/screens';

/**
 * BloodLinks - Blood Donation Platform
 * React Native App test
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignUpScreen from './src/screens/Auth/SignUpScreen';
import { SignUpFormData } from './src/types';





const handleSignUp = (data: SignUpFormData) => {
    console.log('Sign up data:', data);
    // TODO: Implement actual sign up logic
    // This would typically involve API calls to your backend test fdf
  };

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <SignUpScreen 
        onSubmit={handleSignUp}
        loading={false}
      />
    </SafeAreaProvider>
  );
}

export default App;