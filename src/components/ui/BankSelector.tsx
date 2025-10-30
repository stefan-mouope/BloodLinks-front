import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getBanquesDeSang } from '../../api/bankApi';
import { theme } from '../../constants/theme';

interface Bank {
  id: number;
  nom: string;
  localisation: string;
}

interface Props {
  selectedBankId: number | null;
  onBankSelect: (bankId: number | null) => void;
}


const BankSelector: React.FC<Props> = ({ selectedBankId, onBankSelect }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await getBanquesDeSang();
        setBanks(data);
      } catch (error) {
        console.error("Erreur chargement banques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color={theme.colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Banque de sang</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedBankId}
          onValueChange={(value) => onBankSelect(value)}
          style={styles.picker}
        >
          <Picker.Item label="-- Sélectionnez une banque --" value={null} />
          {banks.map((bank) => (
            <Picker.Item
              key={bank.id}
              label={`${bank.nom} (${bank.localisation})`}
              value={bank.id}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default BankSelector;
