// Types pour les rôles d'utilisateur
export type RoleType = 'docteur' | 'banque' | 'donneur';

// Types pour les groupes sanguins
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// Interface pour l'utilisateur
export interface User {
  id: number;
  email: string;
  user_type: RoleType;
  groupe_sanguin?:string;
  nom?:string;
}

// Interface pour les données de connexion
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface pour les données d'inscription
export interface RegisterData {
  // Champs communs
  user_type: RoleType;
  email: string;
  password: string;
  
  // Champs partagés (docteur, donneur, banque)
  nom?: string;
  prenom?: string;
  code_inscription?: string;
  
  // Champs spécifiques docteur
  BanqueDeSang?: number; // ID de la banque de sang
  
  // Champs spécifiques banque
  localisation?: string;
  
  // Champs spécifiques donneur
  groupe_sanguin?: BloodType;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

// Interface pour la réponse de rafraîchissement de token
export interface RefreshTokenResponse {
  access: string;
}

// Interface pour l'état d'authentification (Zustand store)
export interface AuthState {
  // État
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  refreshAccessToken: () => Promise<string | null>;
}

// Interface pour le formulaire d'inscription (UI)
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

// Interface pour le profil docteur
export interface DocteurProfile {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  code_inscription: string;
  BanqueDeSang: number;
}

// Interface pour le profil banque de sang
export interface BanqueDeSangProfile {
  id: number;
  user: User;
  nom: string;
  localisation: string;
  code_inscription: string;
}

// Interface pour le profil donneur
export interface DonneurProfile {
  id: number;
  user: User;
  nom: string;
  prenom: string;
  groupe_sanguin: BloodType;
}

// Type union pour tous les profils
export type UserProfile = DocteurProfile | BanqueDeSangProfile | DonneurProfile;

// Type guard pour vérifier le type de profil
export const isDocteurProfile = (profile: UserProfile): profile is DocteurProfile => {
  return (profile as DocteurProfile).BanqueDeSang !== undefined;
};

export const isBanqueProfile = (profile: UserProfile): profile is BanqueDeSangProfile => {
  return (profile as BanqueDeSangProfile).localisation !== undefined;
};

export const isDonneurProfile = (profile: UserProfile): profile is DonneurProfile => {
  return (profile as DonneurProfile).groupe_sanguin !== undefined;
};