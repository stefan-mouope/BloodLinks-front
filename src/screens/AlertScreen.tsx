import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { AlertService} from '../services/AlertService';
import { Alerte } from '../types/data';

const AlertesScreen = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertes = async () => {
      try {

        const data = await AlertService.getAlertesByGroupe('O+');
        setAlertes(data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertes();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>Erreur : {error}</Text>;

  return (
    <FlatList
      data={alertes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>Alerte #{item.id} - {item.statut}</Text>
          <Text>Groupe sanguin : {item.requete.groupe_sanguin}</Text>
          <Text>Quantité : {item.requete.quantite}</Text>
          <Text>Docteur : {item.requete.docteur.nom} {item.requete.docteur.prenom}</Text>
          <Text>Banque : {item.requete.docteur.banque.nom}</Text>
        </View>
      )}
    />
  );
};

export default AlertesScreen;
