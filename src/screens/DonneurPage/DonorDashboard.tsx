import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { theme } from "../../constants/theme";
import useNotificationListener from "../../firabase/useNotificationListener";
import { useAlertes } from "../../hooks/useAlertes"; 
import { Alerte } from "../../types/data";
import useAuthStore from "../../store/authStore";

const DonorDashboard = () => {
  const {user} = useAuthStore()
  const groupeSanguin = user?.groupe_sanguin || 'O+'; // à remplacer par celui du donneur connecté
  const { alertes, loading, refresh, updateStatut } = useAlertes(groupeSanguin);
  const processedIds = useRef(new Set<string>());

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
                await updateStatut(alerte.id, "accepte");
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

      {/* 🔴 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🩸 Don de Sang - Tableau de Bord</Text>
        <Text style={styles.headerSubtitle}>
          Votre groupe sanguin : <Text style={styles.bloodType}>{groupeSanguin}</Text>
        </Text>
      </View>

      {/* CONTENU */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Alertes reçues ({alertes.length})</Text>

        {loading && <Text style={styles.loadingText}>Chargement des alertes...</Text>}

        {alertes.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>🔔 Aucune alerte pour le moment</Text>
          </View>
        )}

        {alertes.map((alerte) => (
          <View key={alerte.id} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>💉 Don de sang {user?.groupe_sanguin}</Text>
              <Text style={styles.infoText}>
                🏥 Hôpital : {alerte.hopital || "Non précisé"}
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
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DonorDashboard;

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },

  // HEADER
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

  // ÉTAT VIDE
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

  // CARD
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

  // STATUTS
  statusText: { fontWeight: "bold", textTransform: "capitalize" },
  statusAccepted: { color: "#38A169" },
  statusRefused: { color: "#E53E3E" },
  statusPending: { color: "#DD6B20" },

  // BOUTONS
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
