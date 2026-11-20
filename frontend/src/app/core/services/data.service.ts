import { Injectable } from '@angular/core';
import { COMBINAISONS, CRITERES, DOMAINES, ECOLES, METIERS, PARCOURS } from '../data/seed';
import { Combinaison, Critere, Domaine, Ecole, Metier, Parcours } from '../models/models';
import { Collection } from './collection';

/**
 * Source de vérité des contenus (domaines, combinaisons, écoles…).
 * Données en mémoire pour l'instant ; pour brancher le backend, remplir ces collections depuis l'API.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  readonly criteres = new Collection<Critere>(CRITERES);
  readonly domaines = new Collection<Domaine>(DOMAINES);
  readonly combinaisons = new Collection<Combinaison>(COMBINAISONS);
  readonly metiers = new Collection<Metier>(METIERS);
  readonly parcours = new Collection<Parcours>(PARCOURS);
  readonly ecoles = new Collection<Ecole>(ECOLES);

  parcoursDe(cible: string): Parcours[] {
    return this.parcours.items().filter((p) => p.cible === cible).sort((a, b) => a.annee.localeCompare(b.annee));
  }

  combinaisonsDe(domaineId: string): Combinaison[] {
    return this.combinaisons.items().filter((c) => c.domaines.includes(domaineId));
  }

  ecolesDe(domaineId: string): Ecole[] {
    return this.ecoles.items().filter((e) => e.domaines.includes(domaineId));
  }

  /** Lien vers la fiche d'un domaine ou d'une combinaison. */
  lienCible(id: string): string {
    if (this.domaines.get(id)) return `/domaines/domaine/${id}`;
    if (this.combinaisons.get(id)) return `/domaines/combo/${id}`;
    return '/domaines';
  }

  /** Suppression d'un domaine avec nettoyage de tout ce qui y fait référence. */
  removeDomaine(id: string): void {
    this.domaines.remove(id);
    this.combinaisons.items().filter((c) => c.domaines.includes(id)).forEach((c) => this.removeCombinaison(c.id));
    this.nettoyerCible(id);
    this.ecoles.mutate((list) => list.map((e) => ({ ...e, domaines: e.domaines.filter((d) => d !== id) })));
  }

  removeCombinaison(id: string): void {
    this.combinaisons.remove(id);
    this.nettoyerCible(id);
  }

  private nettoyerCible(id: string): void {
    this.parcours.mutate((list) => list.filter((p) => p.cible !== id));
    this.metiers.mutate((list) =>
      list.map((m) => ({ ...m, sources: m.sources.filter((s) => s !== id) })).filter((m) => m.sources.length > 0),
    );
  }
}
