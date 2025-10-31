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
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>⏳ Chargement...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>Aucune requête trouvée</Text>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.bloodType}>{req.groupe_sanguin}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(req.statut)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(req.statut) }]}>
                    {req.statut.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityIcon}>🩸</Text>
                <Text style={styles.units}>{req.quantite} unités demandées</Text>
              </View>
              
              <View style={styles.dateContainer}>
                <Text style={styles.dateIcon}>📅</Text>
                <Text style={styles.date}>
                  {new Date(req.date_requete).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fa' 
  },
  content: { 
    flex: 1 
  },
  buttonContainer: { 
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: { 
    color: theme.colors.white, 
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8 
  },
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    color: '#1a202c',
  },
  card: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: 20,
    borderRadius: 16,
    borderWidth: 0,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bloodType: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a202c',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  units: { 
    fontSize: 16, 
    color: theme.colors.primary, 
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateIcon: {
    fontSize: 14,
    marginRight: 6,
    color: theme.colors.gray500,
  },
  date: { 
    fontSize: 13, 
    color: theme.colors.gray500,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.gray500,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.gray500,
    marginTop: 12,
  },
});

export default DoctorPage;