/** Modèles de données de SUP'COMPASS (alias `type` pour rester compatibles avec le CRUD admin générique). */
export type Annee = '1A' | '2A' | '3A';
export type CritereType = 'interet' | 'disposition';
export type Role = 'user' | 'admin';

/** Critère de l'atlas (un curseur + un axe du radar). */
export type Critere = { id: string; label: string; type: CritereType };

export type Domaine = {
  id: string;
  nom: string;
  resume: string;
  description: string;
  prerequis: string[];
  competences: string[];
  debouches: string[];
  /** Profil du domaine sur les critères de l'atlas (0 à 5, même ordre que les critères). */
  profil: number[];
};

/** Combinaison de deux domaines (ex. IA + Cyber). */
export type Combinaison = {
  id: string;
  nom: string;
  domaines: string[];
  resume: string;
  prerequis: string[];
  debouches: string[];
};

/** Métier de la carte interactive, relié à un ou plusieurs domaines/combinaisons. */
export type Metier = { id: string; nom: string; resume: string; sources: string[] };

/** Étape de roadmap (1A, 2A ou 3A) d'un domaine ou d'une combinaison. */
export type Parcours = { id: string; cible: string; annee: Annee; titre: string; contenu: string[] };

export type Ecole = {
  id: string;
  nom: string;
  pays: string;
  langue: string;
  rangMin: number;
  rangMax: number;
  domaines: string[];
  deadline: string;
  programme: string;
  duree: string;
  conditions: string[];
  siteWeb: string;
  miseAJour: string;
};

export type Utilisateur = { id: string; nom: string; email: string; role: Role };

export type ResultatAtlas = {
  id: string;
  date: string;
  scores: number[];
  top: { domaineId: string; match: number }[];
};

/** Domaine mis en favori par l'utilisateur connecté (ressource /favoris de l'API). */
export type Favori = { id: string; domaineId: string };

/** Message envoyé depuis la page Contact (ressource /messages de l'API). */
export type MessageContact = { nom: string; email: string; message: string };
