import React, { useState, useCallback, useRef, useEffect } from "react";
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
} from "react-native";
import { theme } from "../../constants/theme";
import useNotificationListener from "../../firabase/useNotificationListener";
import { useAlertes } from "../../hooks/useAlertes";
import { Alerte } from "../../types/data";
import useAuthStore from "../../store/authStore";

const DonorDashboard = () => {
  const { user } = useAuthStore();
  const groupeSanguin = user?.groupe_sanguin || "O+";
  const { alertes, loading, refresh, updateStatut } = useAlertes(groupeSanguin);

  const [refreshing, setRefreshing] = useState(false);
  const processedIds = useRef(new Set<string>());

  /** --- Notifications push --- */
  const handleNotification = useCallback(
    async (data: any) => {
      const uniqueId = data.id || `${data.bloodType}-${Date.now()}`;
      if (processedIds.current.has(uniqueId)) return;
      processedIds.current.add(uniqueId);
      await refresh();
      setTimeout(() => processedIds.current.delete(uniqueId), 5000);
    },
    [refresh]
  );

  useNotificationListener(handleNotification);

  /** --- Pull-to-refresh --- */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  /** --- Auto-refresh toutes les 10 secondes --- */
  useEffect(() => {
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleAccept = useCallback(
    async (alerte: Alerte) => {
      Alert.alert(
        "Confirmer le don",
        `Êtes-vous disponible pour donner du sang ${alerte.requete.groupe_sanguin} ?`,
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
      <StatusBar barStyle="light-content" backgroundColor="#C53030" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🩸 Don de Sang - Tableau de Bord</Text>
        <Text style={styles.headerSubtitle}>
          Votre groupe sanguin : <Text style={styles.bloodType}>{groupeSanguin}</Text>
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionTitle}>Alertes reçues ({alertes.length})</Text>

        {loading && <ActivityIndicator size="large" color="#C53030" style={{ marginVertical: 16 }} />}

        {alertes.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🔔 Aucune alerte pour le moment</Text>
          </View>
        )}

        {alertes.map((alerte) => {
          const isValide = alerte.statut === "en_attente" || alerte.statut === "accepte";
          return (
            <View key={alerte.id} style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>💉 Don de sang {alerte.requete.groupe_sanguin}</Text>
                <Text style={styles.infoText}>
                  🏥 Hôpital : {alerte.requete.docteur?.banque?.nom || "Non précisé"}
                </Text>
                <Text style={styles.infoText}>
                  📅 Statut :{" "}
                  <Text
                    style={[
                      styles.statusText,
                      alerte.statut === "accepte"
                        ? styles.statusAccepted
                        : alerte.statut === "refuse"
                        ? styles.statusRefused
                        : styles.statusPending,
                    ]}
                  >
                    {alerte.statut}
                  </Text>
                </Text>
              </View>

              {!isValide && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(alerte)}
                  >
                    <Text style={styles.buttonText}>✅ Accepter</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(alerte)}
                  >
                    <Text style={styles.buttonText}>❌ Refuser</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },

  header: {
    backgroundColor: "#C53030",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#ffeaea",
    fontSize: 16,
    marginTop: 4,
  },
  bloodType: {
    color: "#fff",
    fontWeight: "bold",
  },

  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C53030",
    marginBottom: 16,
  },
  loadingText: {
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },

  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },

  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  alertHeader: {
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53E3E",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },

  statusText: { fontWeight: "bold", textTransform: "capitalize" },
  statusAccepted: { color: "#38A169" },
  statusRefused: { color: "#E53E3E" },
  statusPending: { color: "#DD6B20" },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#38A169",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#E53E3E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DonorDashboard;
