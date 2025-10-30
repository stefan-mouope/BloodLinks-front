import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import api from '../../../src/api/axiosConfig';
import useAuthStore from '../../store/authStore';

interface Request {
  id: number;
  groupe_sanguin: string;
  quantite: number;
  statut: 'en_attente' | 'en_cours' | 'complet';
  date_requete: string;
}
// le commern

const DoctorPage = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/requetes/?docteur=${user?.id}`);
      setRequests(response.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert('Erreur', 'Impossible de récupérer les requêtes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complet': return theme.colors.success;
      case 'en_cours': return theme.colors.warning;
      default: return theme.colors.gray600;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateRequest', { onCreated: fetchRequests })}
            >
              <Text style={{ color: theme.colors.white, fontSize: 24, marginRight: 8 }}>➕</Text>
              <Text style={styles.createButtonText}>Créer une nouvelle requête</Text>
            </TouchableOpacity>

        </View>

        <Text style={styles.sectionTitle}>Mes requêtes</Text>

        {loading ? (
          <Text style={{ padding: 16 }}>Chargement...</Text>
        ) : requests.length === 0 ? (
          <Text style={{ padding: 16 }}>Aucune requête trouvée</Text>
        ) : (
          requests.map((req) => (
            <View key={req.id} style={styles.card}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{req.groupe_sanguin}</Text>
              <Text style={styles.units}>{req.quantite} unités</Text>
              <Text style={[styles.status, { color: getStatusColor(req.statut) }]}>
                {req.statut}
              </Text>
              <Text style={styles.date}>{new Date(req.date_requete).toLocaleString()}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1 },
  buttonContainer: { padding: theme.spacing.md },
  createButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  createButtonText: { color: theme.colors.white, fontWeight: '600', marginLeft: 8 },
  sectionTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', padding: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  units: { fontSize: 14, color: theme.colors.textSecondary, marginVertical: 4 },
  status: { fontWeight: '600' },
  date: { fontSize: 12, color: theme.colors.gray500 },
});

export default DoctorPage;
