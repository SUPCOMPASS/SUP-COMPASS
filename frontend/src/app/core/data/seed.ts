/** Données SYMBOLIQUES (non finales), utilisées tant que le backend n'est pas branché. */
import { Annee, Combinaison, Critere, Domaine, Ecole, Metier, Parcours } from '../models/models';

const ANNEES: Annee[] = ['1A', '2A', '3A'];

function roadmap(cible: string, etapes: [string, string[]][]): Parcours[] {
  return etapes.map(([titre, contenu], i) => ({
    id: `${cible}-${ANNEES[i].toLowerCase()}`,
    cible,
    annee: ANNEES[i],
    titre,
    contenu,
  }));
}

export const CRITERES: Critere[] = [
  { id: 'materiel', label: 'Matériel', type: 'interet' },
  { id: 'maths', label: 'Maths', type: 'interet' },
  { id: 'equipe', label: 'Équipe', type: 'interet' },
  { id: 'concret', label: 'Concret', type: 'interet' },
  { id: 'code', label: 'Code', type: 'disposition' },
  { id: 'creativite', label: 'Créativité', type: 'disposition' },
  { id: 'rigueur', label: 'Rigueur', type: 'disposition' },
  { id: 'recherche', label: 'Recherche', type: 'disposition' },
];

const LOREM =
  'Contenu symbolique : ce texte sera remplacé par la présentation officielle du domaine, validée avec les enseignants et les anciens.';

export const DOMAINES: Domaine[] = [
  {
    id: 'ia', nom: 'IA & Data',
    resume: 'Analyser les données, développer des modèles intelligents et créer des systèmes prédictifs.',
    description: LOREM,
    prerequis: ['Probabilités et statistiques', 'Algèbre linéaire', 'Programmation Python'],
    competences: ['Machine learning', 'Traitement de données', 'Visualisation', 'MLOps'],
    debouches: ['Data scientist', 'Ingénieur ML', 'Data engineer'],
    profil: [1, 5, 3, 2, 5, 4, 3, 5],
  },
  {
    id: 'cy', nom: 'Cybersécurité',
    resume: 'Protéger les réseaux, les applications et les systèmes contre les cyberattaques.',
    description: LOREM,
    prerequis: ['Réseaux de base', 'Systèmes d’exploitation', 'Notions de cryptographie'],
    competences: ['Tests d’intrusion', 'Analyse de risques', 'Cryptographie', 'Supervision SOC'],
    debouches: ['Analyste SOC', 'Pentester', 'Consultant sécurité'],
    profil: [2, 3, 3, 3, 4, 3, 5, 3],
  },
  {
    id: 'em', nom: 'Systèmes embarqués',
    resume: 'Concevoir des solutions combinant matériel, logiciel et objets connectés.',
    description: LOREM,
    prerequis: ['Électronique numérique', 'Langage C', 'Architecture des ordinateurs'],
    competences: ['Microcontrôleurs', 'Temps réel', 'Protocoles IoT', 'Conception de cartes'],
    debouches: ['Ingénieur embarqué', 'Concepteur IoT', 'Ingénieur firmware'],
    profil: [5, 3, 3, 5, 4, 3, 4, 2],
  },
  {
    id: 'rt', nom: 'Réseaux & Télécoms',
    resume: 'Concevoir et exploiter les réseaux mobiles, fibre et cœur de réseau (5G et au-delà).',
    description: LOREM,
    prerequis: ['Théorie du signal', 'Protocoles TCP/IP', 'Probabilités'],
    competences: ['Architecture 5G', 'Routage', 'Virtualisation réseau', 'Qualité de service'],
    debouches: ['Ingénieur réseaux', 'Architecte télécoms', 'Ingénieur 5G'],
    profil: [4, 3, 4, 4, 3, 2, 4, 2],
  },
  {
    id: 'rf', nom: 'Radiofréquences',
    resume: 'Maîtriser antennes, circuits hyperfréquences et systèmes de communication sans fil.',
    description: LOREM,
    prerequis: ['Électromagnétisme', 'Théorie du signal', 'Analyse mathématique'],
    competences: ['Conception d’antennes', 'Circuits RF', 'Mesures', 'Simulation électromagnétique'],
    debouches: ['Ingénieur RF', 'Ingénieur antennes', 'Ingénieur satellite'],
    profil: [5, 5, 2, 4, 2, 3, 5, 4],
  },
  {
    id: 'lg', nom: 'Cloud & Logiciel',
    resume: 'Construire des applications fiables et déployables à grande échelle.',
    description: LOREM,
    prerequis: ['Programmation orientée objet', 'Bases de données', 'Réseaux de base'],
    competences: ['Architecture logicielle', 'DevOps', 'Conteneurs', 'Développement web'],
    debouches: ['Développeur cloud', 'Ingénieur DevOps', 'Architecte logiciel'],
    profil: [1, 2, 4, 2, 5, 5, 3, 2],
  },
];

export const COMBINAISONS: Combinaison[] = [
  { id: 'ia-cy', nom: 'IA + Cyber', domaines: ['ia', 'cy'], resume: 'Détecter les attaques avec l’apprentissage automatique.',
    prerequis: ['Bases en machine learning', 'Bases en sécurité des réseaux'],
    debouches: ['Ingénieur IA sécurité', 'Chercheur en détection d’intrusion'] },
  { id: 'em-ia', nom: 'Embarqué + IA', domaines: ['em', 'ia'], resume: 'Faire tourner l’IA directement sur l’appareil.',
    prerequis: ['Langage C / Python', 'Bases en machine learning'],
    debouches: ['Ingénieur Edge AI', 'Ingénieur vision embarquée'] },
  { id: 'rt-cy', nom: 'Réseaux + Cyber', domaines: ['rt', 'cy'], resume: 'Sécuriser les infrastructures de télécoms.',
    prerequis: ['Protocoles réseau', 'Notions de cryptographie'],
    debouches: ['Architecte sécurité réseau', 'Ingénieur sécurité 5G'] },
];

export const METIERS: Metier[] = [
  { id: 'm1', nom: 'Data scientist', resume: 'Transforme les données en décisions.', sources: ['ia'] },
  { id: 'm2', nom: 'Ingénieur IA sécurité', resume: 'Conçoit des outils de détection d’intrusion.', sources: ['ia-cy'] },
  { id: 'm3', nom: 'Ingénieur Edge AI', resume: 'Déploie des modèles sur des puces à faible énergie.', sources: ['em-ia'] },
  { id: 'm4', nom: 'Architecte sécurité réseau', resume: 'Dessine des réseaux résistants aux attaques.', sources: ['rt-cy'] },
  { id: 'm5', nom: 'Ingénieur RF', resume: 'Conçoit les chaînes de communication sans fil.', sources: ['rf'] },
  { id: 'm6', nom: 'Développeur cloud', resume: 'Déploie des services à grande échelle.', sources: ['lg'] },
];

const ETAPES: [string, string[]][] = [
  ['Découverte', ['Tronc commun', 'Projet d’initiation', 'Contenu symbolique']],
  ['Approfondissement', ['Matières de spécialité', 'Projet en équipe', 'Stage d’été']],
  ['Spécialisation', ['Options avancées', 'Projet de fin d’études', 'Stage PFE']],
];

export const PARCOURS: Parcours[] = [
  ...DOMAINES.flatMap((d) => roadmap(d.id, ETAPES)),
  ...COMBINAISONS.flatMap((c) => roadmap(c.id, ETAPES)),
];

function ecole(
  id: string, nom: string, pays: string, langue: string, rangMin: number, rangMax: number,
  domaines: string[], deadline: string, siteWeb: string,
): Ecole {
  return {
    id, nom, pays, langue, rangMin, rangMax, domaines, deadline, siteWeb,
    programme: 'Programme d’ingénieur en double diplôme (contenu symbolique)',
    duree: '2 ans',
    conditions: ['Dossier académique', 'Niveau de langue requis', 'Lettre de motivation'],
    miseAJour: '2026-11-20',
  };
}

export const ECOLES: Ecole[] = [
  ecole('telecom-paris', 'Télécom Paris', 'France', 'Français', 1, 15, ['ia', 'cy', 'rt'], 'Février 2027', 'https://www.telecom-paris.fr'),
  ecole('imt-atlantique', 'IMT Atlantique', 'France', 'Français', 15, 30, ['ia', 'em', 'rt'], 'Mars 2027', 'https://www.imt-atlantique.fr'),
  ecole('polytechnique-montreal', 'Polytechnique Montréal', 'Canada', 'Français', 10, 30, ['ia', 'lg', 'rt'], 'Janvier 2027', 'https://www.polymtl.ca'),
  ecole('politecnico-torino', 'Politecnico di Torino', 'Italie', 'Anglais', 20, 40, ['em', 'rf'], 'Avril 2027', 'https://www.polito.it'),
  ecole('tu-munich', 'TU Munich', 'Allemagne', 'Anglais', 1, 20, ['cy', 'rf'], 'Mai 2027', 'https://www.tum.de'),
  ecole('insa-lyon', 'INSA Lyon', 'France', 'Français', 30, 50, ['em', 'lg'], 'Mars 2027', 'https://www.insa-lyon.fr'),
];
