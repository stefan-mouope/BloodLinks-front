import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import BottomTabs from '../../components/ui/BottomTabs';
import { useNavigation } from '@react-navigation/native';


interface Request {
  id: string;
  bloodType: string;
  hospital: string;
  units: number;
  status: 'En attente' | 'En cours' | 'Complété';
  urgency: 'Normal' | 'Urgent' | 'Critique';
}

const DoctorPage = () => {
  const requests: Request[] = [
    { id: '1', bloodType: 'A+', hospital: 'Hôpital Central', units: 2, status: 'En attente', urgency: 'Urgent' },
    { id: '2', bloodType: 'O-', hospital: 'Clinique Nord', units: 3, status: 'En cours', urgency: 'Critique' },
    { id: '3', bloodType: 'B+', hospital: 'Hôpital Sud', units: 1, status: 'Complété', urgency: 'Normal' },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critique': return { bg: '#FED7D7', text: '#C53030' };
      case 'Urgent': return { bg: '#FEEBC8', text: '#C05621' };
      case 'Normal': return { bg: '#BEE3F8', text: '#2C5282' };
      default: return { bg: theme.colors.gray100, text: theme.colors.gray600 };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complété': return theme.colors.success;
      case 'En cours': return theme.colors.warning;
      default: return theme.colors.gray600;
    }
  };
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateRequest')}
        >
            <Text style={{ color: theme.colors.white, fontSize: 24, marginRight: 8 }}>＋</Text>
            <Text style={styles.createButtonText}>Créer une nouvelle requête</Text>
        </TouchableOpacity>
        </View>


        <Text style={styles.sectionTitle}>Mes requêtes</Text>

        {requests.map((request) => {
          const urgencyColors = getUrgencyColor(request.urgency);
          const statusColor = getStatusColor(request.status);

          return (
            <View key={request.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{request.bloodType}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}>
                  <Text style={{ color: urgencyColors.text, fontWeight: '600' }}>{request.urgency}</Text>
                </View>
              </View>
              <Text style={styles.hospital}>{request.hospital}</Text>
              <Text style={styles.units}>{request.units} unités requises</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.status, { color: statusColor }]}>{request.status}</Text>
                <Text>⏱️</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <BottomTabs
        tabs={[
          { label: 'Accueil', onPress: () => console.log('Accueil'), active: true },
          { label: 'Historique', onPress: () => console.log('Historique') },
          { label: 'Profil', onPress: () => console.log('Profil') },
        ]}
      />
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
    gap: theme.spacing.sm 
  },
  createButtonText: { 
    color: theme.colors.white, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  sectionTitle: { 
    fontSize: theme.typography.fontSize.lg, 
    fontWeight: 'bold', 
    padding: theme.spacing.md 
  },
  card: { 
    backgroundColor: theme.colors.white, 
    marginHorizontal: theme.spacing.md, 
    marginBottom: theme.spacing.md, 
    padding: theme.spacing.md, 
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    // Shadow pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow pour Android
    elevation: 4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: theme.spacing.sm 
  },
  urgencyBadge: { 
    paddingHorizontal: theme.spacing.md, 
    paddingVertical: theme.spacing.xs, 
    borderRadius: theme.borderRadius.full 
  },
  hospital: { fontSize: 14, marginBottom: 4 },
  units: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  status: { fontWeight: '600' },
});

export default DoctorPage;
