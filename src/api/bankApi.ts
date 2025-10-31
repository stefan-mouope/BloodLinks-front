// api/bankApi.ts
import axios from 'axios';

const API_URL = 'http://172.18.0.1:8000/api'; // ⚠️ Mets ici ton IP du serveur Django (ou ton IPv4 locale)

export const getBanquesDeSang = async () => {
  try {
    const response = await axios.get(`${API_URL}/banques/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des banques :", error);
    throw error;
  }
};
