// App.tsx
import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/Navigation/AppNavigation';
import useAuthStore, { _hasHydrated } from './src/store/authStore';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isReady, setIsReady] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const waitForHydration = setInterval(() => {
      if (_hasHydrated) {
        clearInterval(waitForHydration);
        checkAuth();
        setIsReady(true);
      }
    }, 100);
    return () => clearInterval(waitForHydration);
  }, []);

  if (!isReady) return null; // ou un splash screen

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigation />
    </SafeAreaProvider>
  );
};

export default App;
