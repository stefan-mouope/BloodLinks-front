import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components/ui';
import { theme } from '../../constants/theme';
import {
  responsiveSize,
  responsiveFontSize,
  safeAreaPadding,
} from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../FirstPage/types';
import useAuthStore from '../../store/authStore';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error: authError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.email?.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Veuillez entrer un email valide';

    if (!formData.password?.trim()) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 6)
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login(
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        
      );
      navigation.navigate('Home');  
      console.log('Connexion réussie');
    } catch (err) {
      console.error('Erreur connexion:', err);
      Alert.alert('Erreur', authError || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: safeAreaPadding(theme.spacing.lg),
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: 'space-between',
          paddingBottom: responsiveSize(theme.spacing.xl),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.welcomeText}>Bienvenue</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>
        </View>

        <View>
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

          {authError && <Text style={styles.errorText}>{authError}</Text>}

          <View style={styles.buttonContainer}>
            <Button
              title="Se connecter"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
            />
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Pas de compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}>S'inscrire</Text>
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
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingVertical: theme.spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
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
  errorText: {
    fontSize: responsiveFontSize(theme.typography.fontSize.sm),
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: responsiveSize(theme.spacing.md),
    paddingHorizontal: responsiveSize(theme.spacing.md),
  },
});

export default LoginScreen;
  