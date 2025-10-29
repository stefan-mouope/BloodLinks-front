import { useEffect, useState, useCallback } from "react";
import { AlertService } from "../services/alert/alertServices";
import { Alerte } from "../types/data";

/**
 * Hook pour gérer les alertes (liste, mise à jour, statut, etc.)
 */
export function useAlertes(groupeSanguin?: string) {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger toutes les alertes ou celles d’un groupe sanguin spécifique
   */
  const fetchAlertes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = groupeSanguin
        ? await AlertService.getAlertesByGroupe(groupeSanguin)
        : await AlertService.getAllAlertes();
      setAlertes(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [groupeSanguin]);

  /**
   * Mettre à jour le statut d'une alerte reçue (ex: "accepte" ou "refuse")
   */
  const updateStatut = useCallback(async (id: number, statut: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await AlertService.updateRecevoirAlerteStatut(id, statut);
      // Mettre à jour localement la liste
      setAlertes((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Erreur mise à jour");
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les alertes au montage
  useEffect(() => {
    fetchAlertes();
  }, [fetchAlertes]);

  return {
    alertes,
    loading,
    error,
    refresh: fetchAlertes,
    updateStatut,
  };
}
