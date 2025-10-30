import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, RoleSelector, BloodTypeSelector, BankSelector } from '../../components/ui';
import { theme } from '../../constants/theme';
import { SignUpFormData, RoleType, BloodType } from '../../types/auth';
import { responsiveSize, responsiveFontSize, safeAreaPadding } from '../../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../FirstPage/types';
import useAuthStore from '../../store/authStore';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { register, isLoading, error: authError } = useAuthStore();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    user_type: null,
    email: '',
    password: '',
    // Champs docteur
    nom: '',
    prenom: '',
    code_inscription: '',
    BanqueDeSang: null, // Changé de banque_de_sang_id à BanqueDeSang
    // Champs banque
    localisation: '',
    // Champs donneur
    groupe_sanguin: null,
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const handleRoleSelect = (role: RoleType) => {
    setFormData(prev => ({ ...prev, user_type: role }));
    if (errors.user_type) {
      setErrors(prev => ({ ...prev, user_type: undefined }));
    }
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBloodTypeSelect = (bloodType: BloodType) => {
    setFormData(prev => ({ ...prev, groupe_sanguin: bloodType }));
    if (errors.groupe_sanguin) {
      setErrors(prev => ({ ...prev, groupe_sanguin: undefined }));
    }
  };

  const handleBankSelect = (bankId: number) => {
    setFormData(prev => ({ ...prev, BanqueDeSang: bankId })); // Changé de banque_de_sang_id à BanqueDeSang
    if (errors.BanqueDeSang) {
      setErrors(prev => ({ ...prev, BanqueDeSang: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};
    
    // Validation commune
    if (!formData.user_type) newErrors.user_type = 'Veuillez sélectionner un rôle' as any;
    if (!formData.email?.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Veuillez entrer un email valide';
    if (!formData.password?.trim()) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 6) newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';

    // Validation docteur
    if (formData.user_type === 'docteur') {
      if (!formData.nom?.trim()) newErrors.nom = 'Nom requis';
      if (!formData.prenom?.trim()) newErrors.prenom = 'Prénom requis';
      if (!formData.code_inscription?.trim()) newErrors.code_inscription = 'Code d\'inscription requis';
      else if (!formData.code_inscription.endsWith('DOC')) newErrors.code_inscription = 'Le code doit se terminer par DOC';
      if (!formData.BanqueDeSang) newErrors.BanqueDeSang = 'Veuillez sélectionner une banque de sang' as any;
    }

    // Validation banque
    if (formData.user_type === 'banque') {
      if (!formData.nom?.trim()) newErrors.nom = 'Nom de la banque requis';
      if (!formData.localisation?.trim()) newErrors.localisation = 'Localisation requise';
      if (!formData.code_inscription?.trim()) newErrors.code_inscription = 'Code d\'inscription requis';
      else if (!formData.code_inscription.endsWith('BANC')) newErrors.code_inscription = 'Le code doit se terminer par BANC';
    }

    // Validation donneur
    if (formData.user_type === 'donneur') {
      if (!formData.nom?.trim()) newErrors.nom = 'Nom requis';
      if (!formData.prenom?.trim()) newErrors.prenom = 'Prénom requis';
      if (!formData.groupe_sanguin) newErrors.groupe_sanguin = 'Groupe sanguin requis' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Préparer les données selon le type d'utilisateur
        const dataToSend: any = {
          email: formData.email,
          password: formData.password,
          user_type: formData.user_type,
        };

        if (formData.user_type === 'docteur') {
          dataToSend.nom = formData.nom;
          dataToSend.prenom = formData.prenom;
          dataToSend.code_inscription = formData.code_inscription;
          dataToSend.BanqueDeSang = formData.BanqueDeSang;
        } else if (formData.user_type === 'banque') {
          dataToSend.nom = formData.nom;
          dataToSend.localisation = formData.localisation;
          dataToSend.code_inscription = formData.code_inscription;
        } else if (formData.user_type === 'donneur') {
          dataToSend.nom = formData.nom;
          dataToSend.prenom = formData.prenom;
          dataToSend.groupe_sanguin = formData.groupe_sanguin;
        }

        const success = await register(dataToSend);
        if (success) {
          Alert.alert(
            'Succès',
            'Inscription réussie ! Vous pouvez maintenant vous connecter.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Home'),
              },
            ]
          );
        }
      } catch (err) {
        console.error('Erreur inscription:', err);
        Alert.alert(
          'Erreur',
          authError || 'Une erreur est survenue lors de l\'inscription'
        );
      }
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
        {/* Role Selection */}
        <RoleSelector
          selectedRole={formData.user_type}
          onRoleSelect={handleRoleSelect}
        />
        {errors.user_type && <Text style={getErrorStyle()}>{errors.user_type}</Text>}

        {/* Doctor specific fields */}
        {formData.user_type === 'docteur' && (
          <>
            <Input
              label="Nom"
              placeholder="Entrez votre nom"
              value={formData.nom}
              onChangeText={(value) => handleInputChange('nom', value)}
              error={errors.nom}
            />
            <Input
              label="Prénom"
              placeholder="Entrez votre prénom"
              value={formData.prenom}
              onChangeText={(value) => handleInputChange('prenom', value)}
              error={errors.prenom}
            />
            <Input
              label="Code d'inscription"
              placeholder="Entrez votre code (doit finir par DOC)"
              value={formData.code_inscription}
              onChangeText={(value) => handleInputChange('code_inscription', value)}
              error={errors.code_inscription}
            />
            <BankSelector
              selectedBankId={formData.BanqueDeSang || null}
              onBankSelect={handleBankSelect}
            />
            {errors.BanqueDeSang && <Text style={getErrorStyle()}>{errors.BanqueDeSang}</Text>}
          </>
        )}

        {/* Bank specific fields */}
        {formData.user_type === 'banque' && (
          <>
            <Input
              label="Nom de la banque"
              placeholder="Entrez le nom de la banque"
              value={formData.nom}
              onChangeText={(value) => handleInputChange('nom', value)}
              error={errors.nom}
            />
            <Input
              label="Localisation"
              placeholder="Entrez la localisation"
              value={formData.localisation}
              onChangeText={(value) => handleInputChange('localisation', value)}
              error={errors.localisation}
            />
            <Input
              label="Code d'inscription"
              placeholder="Entrez votre code (doit finir par BANC)"
              value={formData.code_inscription}
              onChangeText={(value) => handleInputChange('code_inscription', value)}
              error={errors.code_inscription}
            />
          </>
        )}

        {/* Donor specific fields */}
        {formData.user_type === 'donneur' && (
          <>
            <Input
              label="Nom"
              placeholder="Entrez votre nom"
              value={formData.nom}
              onChangeText={(value) => handleInputChange('nom', value)}
              error={errors.nom}
            />
            <Input
              label="Prénom"
              placeholder="Entrez votre prénom"
              value={formData.prenom}
              onChangeText={(value) => handleInputChange('prenom', value)}
              error={errors.prenom}
            />
            <BloodTypeSelector
              selectedBloodType={formData.groupe_sanguin || null}
              onBloodTypeSelect={handleBloodTypeSelect}
            />
            {errors.groupe_sanguin && <Text style={getErrorStyle()}>{errors.groupe_sanguin}</Text>}
          </>
        )}

        {/* Email and Password fields */}
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

        {/* Global error message */}
        {authError && <Text style={getErrorStyle()}>{authError}</Text>}
      </ScrollView>

      {/* Submit Button */}
      <View style={{ paddingBottom: safeAreaPadding(theme.spacing.lg) }}>
        <Button
          title="S'inscrire"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Vous avez deja un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signupLink}>Se connecter </Text>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

const styles= StyleSheet.create({
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
})

export default SignUpScreen;