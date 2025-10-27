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
import { useNavigation } from '@react-navigation/native';

type UrgencyLevel = 'Normal' | 'Urgent' | 'Critique';

const CreateRequestScreen = ({ navigation }: any) => {
  const [bloodType, setBloodType] = useState('');
  const [units, setUnits] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Normal');
  const [hospital, setHospital] = useState('');
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = () => {
    if (!bloodType) {
      Alert.alert('Erreur', 'Veuillez sélectionner un groupe sanguin');
      return;
    }
    if (!units || parseInt(units) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un nombre d\'unités valide');
      return;
    }
    if (!hospital.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom de l\'hôpital');
      return;
    }

    Alert.alert(
      'Succès',
      'Votre requête a été envoyée avec succès',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const UrgencyButton = ({ level, label }: { level: UrgencyLevel; label: string }) => {
    const isSelected = urgency === level;
    const getColor = () => {
      switch (level) {
        case 'Critique':
          return theme.colors.error;
        case 'Urgent':
          return theme.colors.warning;
        case 'Normal':
          return theme.colors.info;
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.urgencyButton,
          isSelected && {
            borderColor: getColor(),
            backgroundColor: `${getColor()}15`,
          },
        ]}
        onPress={() => setUrgency(level)}
      >
        <Text
          style={[
            styles.urgencyButtonText,
            isSelected && { color: getColor(), fontWeight: theme.typography.fontWeight.semiBold },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Content */}
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

          {/* Blood Type Picker */}
          {showBloodTypePicker && (
            <View style={styles.pickerContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerItem,
                    bloodType === type && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setBloodType(type);
                    setShowBloodTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerItemText,
                    bloodType === type && styles.pickerItemTextSelected,
                  ]}>
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

        {/* Urgency Level */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Niveau d'urgence</Text>
          <View style={styles.urgencyContainer}>
            <UrgencyButton level="Normal" label="Normal" />
            <UrgencyButton level="Urgent" label="Urgent" />
            <UrgencyButton level="Critique" label="Critique" />
          </View>
        </View>

        {/* Hospital Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Hôpital</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'hôpital"
            placeholderTextColor={theme.colors.gray400}
            value={hospital}
            onChangeText={setHospital}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Votre requête sera envoyée à la banque de sang la plus proche qui notifiera les
            donneurs disponibles.
          </Text>
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
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: { padding: theme.spacing.xs },
  backArrow: { fontSize: 24, color: theme.colors.white },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  content: { flex: 1, backgroundColor: theme.colors.gray50 },
  fieldContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
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
  pickerItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerItemSelected: { backgroundColor: theme.colors.gray50 },
  pickerItemText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  pickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  urgencyContainer: { flexDirection: 'row', gap: theme.spacing.sm },
  urgencyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  urgencyButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    backgroundColor: '#E6F2FF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.info,
    lineHeight: 20,
  },
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
  submitButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default CreateRequestScreen;
