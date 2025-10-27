export interface Banque {
    id: number;
    nom: string;
    localisation?: string;
  }
  
  export interface Docteur {
    id: number;
    nom: string;
    prenom: string;
    banque: Banque;
  }
  
  export interface Requete {
    id: number;
    groupe_sanguin: string;
    quantite: number;
    statut: string;
    docteur: Docteur;
  }
  
  export interface Alerte {
    id: number;
    requete: Requete;
    date_envoi: string;
    statut: string;
  }