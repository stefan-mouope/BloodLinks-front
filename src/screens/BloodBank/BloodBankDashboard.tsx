import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import Header from '../../components/ui/Header';
import { AlertService } from '../../services/alert/alertServices';
import useAuthStore from '../../store/authStore';
import requeteService from '../../services/request/requestService';
import { Requete, Alerte } from '../../types/data';
import useNotificationListener from "../../firabase/useNotificationListener"; // ✅ correction d’orthographe du dossier
import { useAlertes } from "../../hooks/useAlertes"; 

interface RequeteWithAlert extends Requete {
  alertEnvoyee?: boolean; // état local pour savoir si l'alerte a été envoyée
}

const BloodBankDashboard = () => {
  const navigation = useNavigation<any>();
  const [requests, setRequests] = useState<RequeteWithAlert[]>([]);
  const [notificationCount, setNotificationCount] = useState(3); // exemple
  const { user } = useAuthStore();

  // === Référence pour éviter les doublons de notifications ===
  const processedIds = useRef<Set<string>>(new Set());

  // === Récupérer toutes les requêtes de la banque ===
  const fetchRequetes = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data: RequeteWithAlert[] = await requeteService.getByBanque(user.user.id);
      setRequests(data);
    } catch (error) {
      console.error('Erreur récupération requêtes :', error);
      Alert.alert('Erreur', "Impossible de récupérer les requêtes");
    }
  }, [user]);

  useEffect(() => {
    fetchRequetes();
  }, [fetchRequetes]);

  // === Gestion des notifications push ===
  const handleNotification = useCallback(async (data: any) => {
    const uniqueId = data.id || `${data.bloodType}-${Date.now()}`;
    if (processedIds.current.has(uniqueId)) return;
    processedIds.current.add(uniqueId);
    await fetchRequetes();
    setTimeout(() => processedIds.current.delete(uniqueId), 5000);
  }, [fetchRequetes]);

  useNotificationListener(handleNotification);

  // === Couleur selon le statut ===
  const getUrgencyColor = (statut: string) => {
    switch (statut) {
      case 'critique':
        return { bg: '#FED7D7', text: '#C53030' };
      case 'urgent':
        return { bg: '#FEEBC8', text: '#C05621' };
      case 'normal':
        return { bg: '#BEE3F8', text: '#2C5282' };
      default:
        return { bg: '#E2E8F0', text: '#4A5568' };
    }
  };

  // === Créer une alerte ===
  const handleCreateAlert = async (requestId: number) => {
    try {
      const request = requests.find((r) => r.id === requestId);
      if (!request) return;

      await AlertService.createAlerte({
        requete: request.id,
        groupe_sanguin: request.groupe_sanguin,
      });

      // Mettre à jour l’état
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, alertEnvoyee: true } : r
        )
      );

      Alert.alert('Succès', 'Alerte créée avec succès');
    } catch (error) {
      console.error('Erreur création alerte :', error);
      Alert.alert('Erreur', "Échec de la création de l'alerte");
    }
  };

  // === Annuler une requête (localement) ===
  const handleCancelRequest = (requestId: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // === Gestion des alertes reçues (banque qui accepte/refuse) ===
  const { updateStatut } = useAlertes();

  const handleAccept = useCallback(
    async (alerte: Alerte) => {
      Alert.alert(
        "Confirmer le don",
        `Êtes-vous disponible pour donner du sang ${alerte.groupe_sanguin} ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Confirmer",
            onPress: async () => {
              try {
                await updateStatut(alerte.id, "en_attente");
                Alert.alert("Merci ❤️", "Votre disponibilité a été confirmée !");
              } catch {
                Alert.alert("Erreur", "Impossible de confirmer cette alerte.");
              }
            },
          },
        ]
      );
    },
    [updateStatut]
  );

  const handleDecline = useCallback(
    async (alerte: Alerte) => {
      try {
        await updateStatut(alerte.id, "refuse");
        Alert.alert("Refusé", "Vous avez décliné cette demande de don.");
      } catch {
        Alert.alert("Erreur", "Impossible de refuser cette alerte.");
      }
    },
    [updateStatut]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <Header
        navigation={navigation}
        route={{ name: 'bloodbank' } as any}
        notificationCount={notificationCount}
        centerSubtitle="Dashboard Banque de sang"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator>
        <Text style={styles.sectionTitle}>Demandes reçues</Text>

        {requests.map((request) => {
          const urgencyColors = getUrgencyColor(request.statut);

          return (
            <View key={request.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.bloodTypeContainer}>
                  <Text style={styles.bloodType}>{request.groupe_sanguin}</Text>
                </View>
                <View
                  style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}
                >
                  <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
                    {request.statut === 'en_attente' ? 'En attente' : request.statut}
                  </Text>
                </View>
              </View>

              <Text style={styles.units}>{request.quantite} unités requises</Text>

              {request.docteur && (
                <View style={{ marginVertical: 6 }}>
                  <Text style={styles.infoText}>
                    Docteur : {request.docteur.nom} {request.docteur.prenom}
                  </Text>
                  <Text style={styles.infoText}>
                    Matricule : {request.docteur.code_inscription}
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                {!request.alertEnvoyee ? (
                  <TouchableOpacity
                    style={styles.alertButton}
                    onPress={() => handleCreateAlert(request.id)}
                  >
                    <Text style={styles.alertButtonText}>Envoyer alerte</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.alertEnvoyeeText}>Alerte envoyée ✅</Text>
                )}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelRequest(request.id)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { flex: 1, padding: theme.spacing.md, marginTop: 12 },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  bloodTypeContainer: {},
  bloodType: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  urgencyBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  urgencyText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  units: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  alertButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
    backgroundColor: '#38A169',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  alertButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  alertEnvoyeeText: {
    flex: 1,
    marginRight: theme.spacing.sm,
    textAlign: 'center',
    color: '#38A169',
    fontWeight: 'bold',
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
  },
  cancelButton: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    backgroundColor: '#E53E3E',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.sm,
  },
});

export default BloodBankDashboard;
