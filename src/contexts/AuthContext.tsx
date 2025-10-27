import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import useAuthStore from '../store/authStore';

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { 
    isAuthenticated, 
    user, 
    login: loginStore, 
    logout: logoutStore, 
    register: registerStore,
    checkAuth 
  } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      await loginStore(credentials);
    } catch (error) {
      Alert.alert('Erreur de connexion', 'Veuillez vérifier vos identifiants');
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await registerStore(userData);
    } catch (error: any) {
      Alert.alert(
        'Erreur d\'inscription',
        error.message || 'Une erreur est survenue lors de l\'inscription'
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutStore();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
      }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
