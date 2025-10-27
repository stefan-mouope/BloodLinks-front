import api from "../api/axiosConfig";
import { Alerte } from "../types/data";

export class AlertService {
    /**
     * Récupère toutes les alertes envoyées pour un groupe sanguin donné
     * @param groupeSanguin string
     * @param token JWT de l'utilisateur connecté
     */
    static async getAlertesByGroupe(
      groupeSanguin: string,
    ): Promise<Alerte[]> {
      try {
        const response = await api.get<Alerte[]>(`/alert/par-groupe/`, {
          params: { groupe_sanguin: groupeSanguin },
        //   headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error: any) {
        console.error('Erreur récupération alertes :', error?.response?.data || error.message || error);
        throw error;
      }
    }
  }