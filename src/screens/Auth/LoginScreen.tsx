import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, RoleSelector } from '../../components/ui';
import { theme } from '../../constants/theme';
import { responsiveSize, responsiveFontSize, safeAreaPadding } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../FirstPage/types';
import { RoleType } from '../../types';

// Typage de la navigation
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: RoleType | null;
  }>({
    email: '',
    password: '',
    role: null,
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const handleRoleSelect = (role: RoleType) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.email?.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Veuillez entrer un email valide';
    if (!formData.password?.trim()) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log('Login with:', { email: formData.email, password: formData.password, role: formData.role });
      // Logique de connexion ici (ex. appel API)
      // Naviguer vers une page après connexion si nécessaire
    }
  };

  const getContainerStyle = () => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: safeAreaPadding(theme.spacing.lg),
  });

  const getFormStyle = () => ({
    flex: 1,
  });

  const getFormContentStyle = () => ({
    justifyContent: 'space-between' as const,
    paddingBottom: responsiveSize(theme.spacing.xl),
  });

  const getErrorStyle = () => ({
    fontSize: responsiveFontSize(theme.typography.fontSize.sm),
    color: theme.colors.error,
    textAlign: 'center' as const,
    marginBottom: responsiveSize(theme.spacing.md),
    paddingHorizontal: responsiveSize(theme.spacing.md),
  });

  return (
    <SafeAreaView style={getContainerStyle()}>
      
      <ScrollView
        style={getFormStyle()}
        contentContainerStyle={getFormContentStyle()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.welcomeText}>Bienvenue</Text>
        <Text style={styles.subtitle}>Connectez-vous ou créez un compte</Text>
w        <RoleSelector
          selectedRole={formData.role}
          onRoleSelect={handleRoleSelect}
        />
        <Input
          label="Email"
          placeholder="Entrez votre email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          value={formData.password}
          onChangeText={(value) => handleInputChange('password', value)}
          secureTextEntry
          error={errors.password}
        />
        {Object.values(errors).some(error => error) && <Text style={getErrorStyle()}>Veuillez corriger les erreurs ci-dessus.</Text>}
        <View style={styles.buttonContainer}>
          <Button
            title="Se connecter"
            onPress={handleLogin}
            fullWidth
            size="lg"
          />
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>S’inscrire</Text>
            </TouchableOpacity>
            <View>
            <TouchableOpacity
                onPress={() => navigation.navigate('DoctorPage')}
                style={{ padding: 12, backgroundColor: 'blue', borderRadius: 8 }}
              >
                <Text style={{ color: 'green' }}>Voir DoctorPage</Text>
              </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('bloodbank')}
                style={{ padding: 12, backgroundColor: 'green', borderRadius: 8 }}
              >
                <Text style={{ color: 'white' }}>Voir la banque</Text>
              </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('donor')}
                style={{ padding: 12, backgroundColor: 'green', borderRadius: 8 }}
              >
                <Text style={{ color: 'white' }}>Voir Donneur</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  roleText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    paddingVertical: theme.spacing.md,
  },
  signupContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing.sm,
  marginBottom: theme.spacing.lg,
},
signupText: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.fontSize.base,
},
signupLink: {
  color: theme.colors.primary,
  fontSize: theme.typography.fontSize.base,
  fontWeight: theme.typography.fontWeight.semiBold,
},

});

export default LoginScreen;