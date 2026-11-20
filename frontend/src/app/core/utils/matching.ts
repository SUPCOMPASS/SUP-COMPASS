import { Domaine } from '../models/models';

export const MAX_NOTE = 5;
export const NOTE_NEUTRE = 3;

export type DomaineScore = { domaine: Domaine; match: number };

/** Classe les domaines selon leur proximité avec les notes (0 à 5) données sur chaque critère. */
export function classerDomaines(notes: number[], domaines: Domaine[]): DomaineScore[] {
  const max = MAX_NOTE * Math.max(notes.length, 1);
  return domaines
    .map((domaine) => {
      const ecart = notes.reduce((somme, note, i) => somme + Math.abs(note - (domaine.profil[i] ?? 0)), 0);
      return { domaine, match: Math.round(100 * (1 - ecart / max)) };
    })
    .sort((a, b) => b.match - a.match);
}
