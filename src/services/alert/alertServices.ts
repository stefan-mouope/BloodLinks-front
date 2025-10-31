import api from "../../api/axiosConfig";
import { Alerte } from "../../types/data";

export class AlertService {
  /**
   * 🔹 Récupère toutes les alertes
   */
  static async getAllAlertes(): Promise<Alerte[]> {
    try {
      const response = await api.get<Alerte[]>("/alertes/");
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération alertes :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Crée une nouvelle alerte
   */
  static async createAlerte(data: Partial<Alerte>): Promise<Alerte> {
    try {
      const response = await api.post<Alerte>("/alertes/", data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur création alerte :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Récupère les alertes d’un groupe sanguin spécifique
   */
  static async getAlertesByGroupe(groupeSanguin: string): Promise<Alerte[]> {
    try {
      const response = await api.get<Alerte[]>("/alertes/par-groupe/", {
        params: { groupe_sanguin: groupeSanguin },
      });
      console.log(response.data)
      
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération alertes :", error?.response?.data || error.message);
      throw error;
    }
  }



  /**
     * 🔹 Récupère les alertes envoyées pour une banque spécifique
     */
    static async getAlertesEnvoyeesParBanque(banqueId: number): Promise<Alerte[]> {
      try {
        const response = await api.get<Alerte[]>("/alertes/banque/", {
          params: { banque_id: banqueId },
        });
        return response.data;
      } catch (error: any) {
        console.error(
          "Erreur récupération alertes envoyées par banque :",
          error?.response?.data || error.message
        );
        throw error;
      }
    }


  /**
   * 🔹 Récupère une alerte spécifique
   */
  static async getAlerteById(id: number): Promise<Alerte> {
    try {
      const response = await api.get<Alerte>(`/alertes/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération alerte :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Met à jour partiellement une alerte (PATCH)
   */
  static async updateAlerte(id: number, data: Partial<Alerte>): Promise<Alerte> {
    try {
      const response = await api.patch<Alerte>(`/alertes/${id}/`, data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur mise à jour alerte :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Supprime une alerte
   */
  static async deleteAlerte(id: number): Promise<void> {
    try {
      await api.delete(`/alertes/${id}/`);
    } catch (error: any) {
      console.error("Erreur suppression alerte :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Liste des alertes reçues (RecevoirAlerte)
   */
  static async getRecevoirAlertes(): Promise<any[]> {
    try {
      const response = await api.get("/alertes/recevoir_alerte/");
      return response.data;
    } catch (error: any) {
      console.error("Erreur récupération recevoir_alerte :", error?.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 🔹 Met à jour le statut d’une alerte reçue (accepte / refuse)
   */
  static async updateRecevoirAlerteStatut(id: number, statut: string): Promise<any> {
    try {
      const response = await api.patch(`/alertes/recevoir_alerte/${id}/`, { statut });
      return response.data;
    } catch (error: any) {
      console.error("Erreur mise à jour statut :", error?.response?.data || error.message);
      throw error;
    }
  }
}
