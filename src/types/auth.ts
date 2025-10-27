// Types pour les rôles d'utilisateur
export type RoleType = 'docteur' | 'banque' | 'donneur';

// Types pour les groupes sanguins
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Interface pour le formulaire d'inscription
export interface SignUpFormData {
  // Champs communs
  user_type: RoleType | null;
  email: string;
  password: string;
  
  // Champs partagés (docteur, donneur, banque)
  nom: string;
  prenom: string;
  code_inscription: string;
  
  // Champs spécifiques docteur
  BanqueDeSang: number | null; // ID de la banque de sang
  
  // Champs spécifiques banque
  localisation: string;
  
  // Champs spécifiques donneur
  groupe_sanguin: BloodType | null;
}

// Interface pour la connexion
export interface LoginFormData {
  email: string;
  password: string;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  id: number;
  email: string;
  user_type: RoleType;
  refresh: string;
  access: string;
}

// Interface pour l'utilisateur connecté
export interface User {
  id: number;
  email: string;
  user_type: RoleType;
}

// Interface pour le docteur
export interface Docteur {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  code_inscription: string;
  BanqueDeSang: number;
}

// Interface pour la banque de sang
export interface BanqueDeSang {
  id: number;
  user: User;
  nom: string;
  localisation: string;
  code_inscription: string;
}

// Interface pour le donneur
export interface Donneur {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  groupe_sanguin: BloodType;
}