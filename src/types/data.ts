export interface Banque {
    id: number;
    nom: string;
    localisation?: string;
  }
  
  export interface Docteur {
    id: number;
    nom: string;
    prenom: string;
    code_inscription:string,
    banque: Banque;
  }
  
  // export interface Requete {
  //   id: number;
  //   groupe_sanguin: string;
  //   quantite: number;
  //   statut: string;
  //   docteur: Docteur;
  // }
  
  export interface Alerte {
    id: number;
    requete: number;
    groupe_sanguin: string;
    date_envoi: string;
    statut: string;
  }

  export interface Requete{
 id: number;
  docteur: Docteur;
  groupe_sanguin: string;
  quantite: number;
  description?: string;
  statut: string;
  date_requete: string;
  }