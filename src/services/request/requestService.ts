import api from "../../api/axiosConfig";
import { Requete } from "../../types/data";

const requeteService = {
  // 🔹 Récupérer toutes les requêtes
  getAll: async (): Promise<Requete[]> => {
    const response = await api.get('/requetes/');
    return response.data;
  },

  // 🔹 Récupérer toutes les requêtes d’une banque spécifique
  getByBanque: async (banqueId: number): Promise<Requete[]> => {
    const response = await api.get(`/requetes/par-banque/${banqueId}/`);
    return response.data;
  },

  // 🔹 Créer une nouvelle requête
  create: async (data: {
    docteur: number;
    groupe_sanguin: string;
    quantite: number;
    description?: string;
  }): Promise<Requete> => {
    const response = await api.post('/requetes/', data);
    return response.data;
  },

  // 🔹 Mettre à jour le statut d’une requête (anciennement valider)
  updateStatus: async (requeteId: number, statut: string): Promise<Requete> => {
    const response = await api.patch(`/requetes/${requeteId}/mettre-a-jour-statut/`, { statut });
    return response.data;
  },
};

export default requeteService;
