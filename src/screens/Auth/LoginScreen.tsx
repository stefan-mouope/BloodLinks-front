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
import Header from '../../components/ui/HeaderAuth';
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
import useNotification from '../../firabase/useNotification';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading, error: authError, user } = useAuthStore();

  // 🔹 Hook pour envoyer automatiquement le token FCM dès que l'utilisateur est connecté
  useNotification(user?.id || null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
      const success = await login({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      if (success) {
        console.log('Connexion réussie');
        navigation.navigate('Home');  
      }
    } catch (err) {
      console.error('Erreur connexion:', err);
      Alert.alert('Erreur', authError || 'Email ou mot de passe incorrect');
    }
  };

  const handleBackFirstPage = () => {
    navigation.navigate('FirstPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Bienvenue"
        subtitle="Connectez-vous à votre compte"
        onBackPress={handleBackFirstPage}
        showBackButton={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: safeAreaPadding(theme.spacing.lg),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // justifyContent: 'center',
    marginTop: responsiveSize(theme.spacing.md),
    paddingBottom: responsiveSize(theme.spacing.xl),
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    paddingVertical: responsiveSize(theme.spacing.md),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveSize(theme.spacing.md),
  },
  signupText: {
    color: theme.colors.textSecondary,
    fontSize: responsiveFontSize(theme.typography.fontSize.base),
  },
  signupLink: {
    color: theme.colors.primary,
    fontSize: responsiveFontSize(theme.typography.fontSize.base),
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