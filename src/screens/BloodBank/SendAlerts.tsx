import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import Header from '../../components/ui/Header';
import useAuthStore, { _hasHydrated } from '../../store/authStore';
import { Alerte } from '../../types/data';
import { AlertService } from '../../services/alert/alertServices';

const SentAlerts = () => {
  const navigation = useNavigation<any>();
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  if (!_hasHydrated || !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ color: theme.colors.textPrimary }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const showError = (title: string, error: any) => {
    let message = 'Une erreur est survenue.';
    if (error.response) {
      message = `Erreur ${error.response.status} : ${
        error.response.data?.detail || JSON.stringify(error.response.data)
      }`;
    } else if (error.request) {
      message = "Aucune réponse du serveur.";
    } else if (error.message) {
      message = error.message;
    }
    console.error('[DÉTAILS ERREUR]', error);
    setAlertes([]);
    // Alert.alert(title, message);
  };

  /** --- Fetch alerts --- */
  const fetchSentAlerts = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await AlertService.getAlertesEnvoyeesParBanque(user.id);
      setAlertes(data);
    } catch (error) {
      showError('Erreur lors du chargement des alertes', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /** --- Pull-to-refresh --- */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSentAlerts();
    setRefreshing(false);
  }, [fetchSentAlerts]);

  /** --- Auto-refresh toutes les 10 secondes --- */
  useEffect(() => {
    fetchSentAlerts();
    const interval = setInterval(fetchSentAlerts, 10000);
    return () => clearInterval(interval);
  }, [fetchSentAlerts]);

  /** --- Valider / Refuser alerte --- */
  const handleValidateAlert = async (alerteId: number) => {
    try {
      const alerte = alertes.find(a => a.id === alerteId);
      if (!alerte) return;

      await AlertService.updateAlerte(alerteId, { statut: 'acceptee' });
      setAlertes(prev => prev.filter(a => a.id !== alerteId));
      Alert.alert('Succès', 'Alerte et requête validées ✅');
    } catch (error) {
      showError('Erreur de validation', error);
    }
  };

  const handleRefuseAlert = async (alerteId: number) => {
    try {
      const alerte = alertes.find(a => a.id === alerteId);
      if (!alerte) return;

      await AlertService.updateAlerte(alerteId, { statut: 'refusee' });
      setAlertes(prev => prev.filter(a => a.id !== alerteId));
      Alert.alert('Succès', 'Alerte et requête refusées ❌');
    } catch (error) {
      showError('Erreur de refus', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.textPrimary, marginTop: 8 }}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <Header
        navigation={navigation}
        route={{ name: 'sentAlerts' } as any}
        notificationCount={alertes.length}
        centerSubtitle="Alertes envoyées"
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Alertes envoyées</Text>

        {alertes.length === 0 && (
          <Text style={styles.emptyText}>Aucune alerte envoyée pour le moment.</Text>
        )}

        {alertes.map((alerte) => (
          <View key={alerte.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.bloodType}>{alerte.requete.groupe_sanguin}</Text>
              <Text style={styles.urgencyText}>{alerte.statut}</Text>
            </View>

            <Text style={styles.units}>{alerte.requete.quantite} unités requises</Text>
            <Text style={styles.infoText}>Statut de la requête : {alerte.requete.statut}</Text>
            <Text style={styles.infoText}>
              Envoyée le : {new Date(alerte.date_envoi).toLocaleString()}
            </Text>

            {alerte.requete.docteur && (
              <View style={{ marginVertical: 6 }}>
                <Text style={styles.infoText}>
                  Dr {alerte.requete.docteur.nom} {alerte.requete.docteur.prenom}
                </Text>
                {alerte.requete.docteur.banque && (
                  <Text style={styles.infoText}>
                    Banque : {alerte.requete.docteur.banque.nom} ({alerte.requete.docteur.banque.localisation})
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.validateButton}
                onPress={() => handleValidateAlert(alerte.id)}
              >
                <Text style={styles.validateButtonText}>Valider</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.refuseButton}
                onPress={() => handleRefuseAlert(alerte.id)}
              >
                <Text style={styles.refuseButtonText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

/** === Styles (inchangés) === */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: theme.spacing.md, marginTop: 12 },
  sectionTitle: { fontSize: theme.typography.fontSize.lg, fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  emptyText: { textAlign: 'center', color: theme.colors.textSecondary, marginTop: 20 },
  card: { backgroundColor: theme.colors.white, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, marginBottom: theme.spacing.md, ...theme.shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  bloodType: { fontSize: theme.typography.fontSize.xl, fontWeight: 'bold' },
  urgencyText: { fontSize: theme.typography.fontSize.sm, fontWeight: '600', color: '#D69E2E' },
  units: { fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  infoText: { fontSize: theme.typography.fontSize.sm, color: theme.colors.textSecondary },
  validateButton: { backgroundColor: '#38A169', paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.lg, alignItems: 'center', flex: 1, marginRight: 5 },
  validateButtonText: { color: theme.colors.white, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semiBold },
  refuseButton: { backgroundColor: '#E53E3E', paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.lg, alignItems: 'center', flex: 1, marginLeft: 5 },
  refuseButtonText: { color: theme.colors.white, fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semiBold },
  buttonContainer: { flexDirection: 'row', marginTop: theme.spacing.md },
});

export default SentAlerts;
