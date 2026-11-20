import { RenderMode, ServerRoute } from '@angular/ssr';

/** Pages publiques statiques : pré-rendues au build. */
const PAGES_STATIQUES = ['', 'domaines', 'atlas', 'double-diplome', 'connexion', 'inscription',
  'mot-de-passe-oublie', 'a-propos', 'contact', 'confidentialite'];

export const serverRoutes: ServerRoute[] = [
  // Fiches dépendant d'un :id → rendues à la demande
  { path: 'domaines/domaine/:id', renderMode: RenderMode.Server },
  { path: 'domaines/combo/:id', renderMode: RenderMode.Server },
  { path: 'double-diplome/:id', renderMode: RenderMode.Server },
  // Zones protégées (session dans le navigateur) → rendues côté client
  { path: 'profil', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  ...PAGES_STATIQUES.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  { path: '**', renderMode: RenderMode.Server },
];