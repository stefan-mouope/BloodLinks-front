import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { theme } from '../../constants/theme';
import useAuthStore from '../../store/authStore';
import api from '../../../src/api/axiosConfig';

const CreateRequestScreen = ({ navigation, route }: any) => {
  const { user } = useAuthStore();
  const [bloodType, setBloodType] = useState('');
  const [units, setUnits] = useState('');
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async () => {
    if (!bloodType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un groupe sanguin');
      return;
    }
    if (!units || parseInt(units) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un nombre d\'unités valide');
      return;
    }

    try {
      const response = await api.post('/requetes/', {
        groupe_sanguin: bloodType,
        quantite: parseInt(units),
      });

      // Si la fonction onCreated est passée, l'appeler pour mettre à jour la liste
      if (route.params?.onCreated) {
        route.params.onCreated();
      }

      Alert.alert('Succès', 'Votre requête a été envoyée avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert('Erreur', err.response?.data?.detail || 'Une erreur est survenue');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Blood Type Selector */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Groupe sanguin</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowBloodTypePicker(!showBloodTypePicker)}
          >
            <Text style={[styles.inputText, !bloodType && styles.placeholderText]}>
              {bloodType || 'Sélectionner'}
            </Text>
            <Text style={styles.chevron}>{showBloodTypePicker ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showBloodTypePicker && (
            <View style={styles.pickerContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.pickerItem, bloodType === type && styles.pickerItemSelected]}
                  onPress={() => {
                    setBloodType(type);
                    setShowBloodTypePicker(false);
                  }}
                >
                  <Text style={[styles.pickerItemText, bloodType === type && styles.pickerItemTextSelected]}>
                    {type} {bloodType === type ? '✓' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Number of Units */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nombre d'unités</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2"
            placeholderTextColor={theme.colors.gray400}
            value={units}
            onChangeText={setUnits}
            keyboardType="numeric"
          />
        </View>

      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Envoyer la requête</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1 },
  fieldContainer: { paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.lg },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { flex: 1, fontSize: theme.typography.fontSize.base, color: theme.colors.textPrimary },
  placeholderText: { color: theme.colors.gray400 },
  chevron: { fontSize: 16, color: theme.colors.gray400 },
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  pickerItem: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  pickerItemSelected: { backgroundColor: theme.colors.gray50 },
  pickerItemText: { fontSize: theme.typography.fontSize.base, color: theme.colors.textPrimary, fontWeight: theme.typography.fontWeight.medium },
  pickerItemTextSelected: { color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold },
  footer: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  submitButtonText: { color: theme.colors.white, fontSize: theme.typography.fontSize.base, fontWeight: theme.typography.fontWeight.bold },
});

export default CreateRequestScreen;
