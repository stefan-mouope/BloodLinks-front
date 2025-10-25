import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, RoleSelector, BloodTypeSelector, BankSelector } from '../../components/ui';
import { theme } from '../../constants/theme';
import { SignUpFormData, RoleType, BloodType } from '../../types';
import { responsiveSize, responsiveFontSize, dynamicWidth, safeAreaPadding } from '../../utils/responsive';

interface SignUpScreenProps {
  onSubmit: (data: SignUpFormData) => void;
  loading?: boolean;
  error?: string;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    user_type: null as any,
    email: '',
    password: '',
    // Doctor fields
    nom: '',
    prenom: '',
    code_inscription: '',
    banque_de_sang_id: null as any,
    // Bank fields
    nom_banque: '',
    localisation: '',
    code_inscription_banque: '',
    // Donor fields
    nom_donneur: '',
    prenom_donneur: '',
    groupe_sanguin: null as any,
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

  const handleRoleSelect = (role: RoleType) => {
    setFormData(prev => ({ ...prev, user_type: role }));
    // Clear role error when user selects a role
    if (errors.user_type) {
      setErrors(prev => ({ ...prev, user_type: undefined }));
    }
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
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
    setFormData(prev => ({ ...prev, banque_de_sang_id: bankId }));
    if (errors.banque_de_sang_id) {
      setErrors(prev => ({ ...prev, banque_de_sang_id: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    // Common validation
    if (!formData.user_type) {
      newErrors.user_type = 'Veuillez sélectionner un rôle' as any;
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Doctor specific validation
    if (formData.user_type === 'docteur') {
      if (!formData.nom?.trim()) {
        newErrors.nom = 'Nom requis';
      }
      if (!formData.prenom?.trim()) {
        newErrors.prenom = 'Prénom requis';
      }
      if (!formData.code_inscription?.trim()) {
        newErrors.code_inscription = 'Code d\'inscription requis';
      } else if (!formData.code_inscription.endsWith('DOC')) {
        newErrors.code_inscription = 'Le code doit se terminer par DOC';
      }
      if (!formData.banque_de_sang_id) {
        newErrors.banque_de_sang_id = 'Veuillez sélectionner une banque de sang' as any;
      }
    }

    // Bank specific validation
    if (formData.user_type === 'banque') {
      if (!formData.nom_banque?.trim()) {
        newErrors.nom_banque = 'Nom de la banque requis';
      }
      if (!formData.localisation?.trim()) {
        newErrors.localisation = 'Localisation requise';
      }
      if (!formData.code_inscription_banque?.trim()) {
        newErrors.code_inscription_banque = 'Code d\'inscription requis';
      } else if (!formData.code_inscription_banque.endsWith('BANC')) {
        newErrors.code_inscription_banque = 'Le code doit se terminer par BANC';
      }
    }

    // Donor specific validation
    if (formData.user_type === 'donneur') {
      if (!formData.nom_donneur?.trim()) {
        newErrors.nom_donneur = 'Nom requis';
      }
      if (!formData.prenom_donneur?.trim()) {
        newErrors.prenom_donneur = 'Prénom requis';
      }
      if (!formData.groupe_sanguin) {
        newErrors.groupe_sanguin = 'Groupe sanguin requis' as any;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getHeaderStyle = () => ({
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: responsiveSize(theme.spacing.xl),
    paddingHorizontal: safeAreaPadding(theme.spacing.md),
  });

  const getTabButtonStyle = (isActive: boolean) => ({
    flex: 1,
    paddingVertical: responsiveSize(theme.spacing.sm),
    paddingHorizontal: responsiveSize(theme.spacing.md),
    borderRadius: theme.borderRadius.lg,
    backgroundColor: isActive ? theme.colors.primary : theme.colors.gray100,
    marginHorizontal: responsiveSize(theme.spacing.xs),
  });

  const getTabTextStyle = (isActive: boolean) => ({
    fontSize: responsiveFontSize(theme.typography.fontSize.base),
    fontWeight: theme.typography.fontWeight.semiBold,
    color: isActive ? theme.colors.white : theme.colors.textSecondary,
    textAlign: 'center' as const,
  });

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
      {/* Header with Sign Up / Login tabs */}
      <View style={getHeaderStyle()}>
        <TouchableOpacity style={getTabButtonStyle(true)}>
          <Text style={getTabTextStyle(true)}>S'inscrire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={getTabButtonStyle(false)}>
          <Text style={getTabTextStyle(false)}>Se connecter</Text>
        </TouchableOpacity>
      </View>

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
              selectedBankId={formData.banque_de_sang_id || null}
              onBankSelect={handleBankSelect}
            />
          </>
        )}

        {/* Bank specific fields */}
        {formData.user_type === 'banque' && (
          <>
            <Input
              label="Nom de la banque"
              placeholder="Entrez le nom de la banque"
              value={formData.nom_banque}
              onChangeText={(value) => handleInputChange('nom_banque', value)}
              error={errors.nom_banque}
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
              value={formData.code_inscription_banque}
              onChangeText={(value) => handleInputChange('code_inscription_banque', value)}
              error={errors.code_inscription_banque}
            />
          </>
        )}

        {/* Donor specific fields */}
        {formData.user_type === 'donneur' && (
          <>
            <Input
              label="Nom"
              placeholder="Entrez votre nom"
              value={formData.nom_donneur}
              onChangeText={(value) => handleInputChange('nom_donneur', value)}
              error={errors.nom_donneur}
            />
            <Input
              label="Prénom"
              placeholder="Entrez votre prénom"
              value={formData.prenom_donneur}
              onChangeText={(value) => handleInputChange('prenom_donneur', value)}
              error={errors.prenom_donneur}
            />
            <BloodTypeSelector
              selectedBloodType={formData.groupe_sanguin || null}
              onBloodTypeSelect={handleBloodTypeSelect}
            />
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
        {error && <Text style={getErrorStyle()}>{error}</Text>}
      </ScrollView>

      {/* Submit Button */}
      <View style={{ paddingBottom: safeAreaPadding(theme.spacing.lg) }}>
        <Button
          title="S'inscrire"
          onPress={handleSubmit}
          loading={loading}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
