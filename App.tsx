import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/Navigation/AppNavigation';
// import { setupNotificationListeners } from './src/firabase/NotificationListener';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
 
  useEffect(()=>{
    // setupNotificationListeners()
  },[])
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigation/>
    </SafeAreaProvider>
  );
};

export default App;