import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

const TITRE = "SUP'COMPASS";
const ADMIN_SECTIONS = ['domaines', 'combinaisons', 'parcours', 'ecoles', 'criteres'] as const;

/** Pages chargées à la demande (lazy loading). Arborescence = sitemap de l'Objectif 2. */
export const routes: Routes = [
  { path: '', title: `Accueil | ${TITRE}`, loadComponent: () => import('./features/home/pages/home/home').then((m) => m.Home) },
  {
    path: 'domaines',
    children: [
      { path: '', title: `Domaines | ${TITRE}`,
        loadComponent: () => import('./features/orientation/pages/domaines/domaines').then((m) => m.Domaines) },
      { path: 'domaine/:id',
        loadComponent: () => import('./features/orientation/pages/fiche-domaine/fiche-domaine').then((m) => m.FicheDomaine) },
      { path: 'combo/:id',
        loadComponent: () => import('./features/orientation/pages/fiche-combinaison/fiche-combinaison').then((m) => m.FicheCombinaison) },
    ],
  },
  { path: 'atlas', title: `Atlas d’orientation | ${TITRE}`,
    loadComponent: () => import('./features/orientation/pages/atlas/atlas').then((m) => m.Atlas) },
  { path: 'quiz', title: `Quiz d’orientation | ${TITRE}`,
    loadComponent: () => import('./features/orientation/pages/quiz/quiz').then((m) => m.Quiz) },
  {
    path: 'double-diplome',
    children: [
      { path: '', title: `Double diplôme | ${TITRE}`,
        loadComponent: () => import('./features/double-diplome/pages/ecoles/ecoles').then((m) => m.Ecoles) },
      { path: ':id',
        loadComponent: () => import('./features/double-diplome/pages/fiche-ecole/fiche-ecole').then((m) => m.FicheEcole) },
    ],
  },

  // Authentification : même composant, mode fourni par `data`
  ...(
    [
      ['connexion', 'login', 'Connexion'],
      ['inscription', 'register', 'Inscription'],
      ['mot-de-passe-oublie', 'forgot', 'Mot de passe oublié'],
    ] as const
  ).map(([path, mode, titre]) => ({
    path,
    title: `${titre} | ${TITRE}`,
    data: { mode },
    loadComponent: () => import('./features/authentification/pages/login/login').then((m) => m.Login),
  })),

  { path: 'profil', canActivate: [authGuard], title: `Mon profil | ${TITRE}`,
    loadComponent: () => import('./features/profil/pages/profil/profil').then((m) => m.Profil) },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/pages/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'domaines', pathMatch: 'full' },
      ...ADMIN_SECTIONS.map((section) => ({
        path: section,
        title: `Admin · ${section} | ${TITRE}`,
        data: { section },
        loadComponent: () => import('./features/admin/pages/admin-section/admin-section').then((m) => m.AdminSection),
      })),
    ],
  },

  // Pied de page et pages système
  { path: 'a-propos', title: `À propos | ${TITRE}`,
    loadComponent: () => import('./features/pages-statiques/a-propos/a-propos').then((m) => m.APropos) },
  { path: 'contact', title: `Contact | ${TITRE}`,
    loadComponent: () => import('./features/pages-statiques/contact/contact').then((m) => m.Contact) },
  { path: 'confidentialite', title: `Confidentialité | ${TITRE}`,
    loadComponent: () => import('./features/pages-statiques/confidentialite/confidentialite').then((m) => m.Confidentialite) },
  { path: '**', title: `Page introuvable | ${TITRE}`,
    loadComponent: () => import('./features/pages-statiques/not-found/not-found').then((m) => m.NotFound) },
];
