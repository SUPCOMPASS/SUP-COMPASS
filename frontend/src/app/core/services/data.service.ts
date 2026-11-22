import { Injectable, inject, signal } from '@angular/core';
import { Combinaison, Critere, Domaine, Ecole, Metier, Parcours } from '../models/models';
import { ApiService } from './api.service';
import { Collection } from './collection';

/** Ressources de contenu servies par l'API (même nom que les routes REST). */
export type Ressource =
  'criteres' | 'domaines' | 'combinaisons' | 'metiers' | 'parcours' | 'ecoles';
export type LoadStatus = 'loading' | 'ready' | 'error';

type Row = { id: string };

/**
 * Source de vérité des contenus (domaines, combinaisons, écoles…), chargés depuis l'API.
 * Les pages lisent les collections (signaux) ; l'espace admin écrit via save() / remove().
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly api = inject(ApiService);

  readonly criteres = new Collection<Critere>();
  readonly domaines = new Collection<Domaine>();
  readonly combinaisons = new Collection<Combinaison>();
  readonly metiers = new Collection<Metier>();
  readonly parcours = new Collection<Parcours>();
  readonly ecoles = new Collection<Ecole>();

  /** État du chargement initial ('loading' aussi pendant le rendu serveur : les pages affichent un squelette). */
  readonly status = signal<LoadStatus>('loading');
  readonly error = signal('');

  private enCours: Promise<void> | null = null;

  /** Charge (ou recharge) tous les contenus en parallèle. */
  load(): Promise<void> {
    this.enCours ??= this.chargerTout().finally(() => (this.enCours = null));
    return this.enCours;
  }

  /** Collection correspondant à une ressource (utilisé par l'admin générique). */
  collection(ressource: Ressource): Collection<Row> {
    return this[ressource] as unknown as Collection<Row>;
  }

  /** Crée (POST) ou remplace (PUT) un élément, puis met à jour la copie locale. */
  async save<T extends Row>(ressource: Ressource, item: T, creation: boolean): Promise<T> {
    const saved = creation
      ? await this.api.post<T>(`/${ressource}`, item)
      : await this.api.put<T>(`/${ressource}/${encodeURIComponent(item.id)}`, item);
    this.collection(ressource).upsert(saved);
    return saved;
  }

  /**
   * Supprime un élément. Pour un domaine ou une combinaison, l'API supprime aussi en cascade
   * (combinaisons, parcours, métiers, liens des écoles) : on recharge alors tous les contenus.
   */
  async remove(ressource: Ressource, id: string): Promise<void> {
    await this.api.delete(`/${ressource}/${encodeURIComponent(id)}`);
    if (ressource === 'domaines' || ressource === 'combinaisons') await this.load();
    else this.collection(ressource).remove(id);
  }

  parcoursDe(cible: string): Parcours[] {
    return this.parcours
      .items()
      .filter((p) => p.cible === cible)
      .sort((a, b) => a.annee.localeCompare(b.annee));
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

  private async chargerTout(): Promise<void> {
    if (this.status() !== 'ready') this.status.set('loading');
    this.error.set('');
    try {
      const [criteres, domaines, combinaisons, metiers, parcours, ecoles] = await Promise.all([
        this.api.get<Critere[]>('/criteres'),
        this.api.get<Domaine[]>('/domaines'),
        this.api.get<Combinaison[]>('/combinaisons'),
        this.api.get<Metier[]>('/metiers'),
        this.api.get<Parcours[]>('/parcours'),
        this.api.get<Ecole[]>('/ecoles'),
      ]);
      this.criteres.set(criteres);
      this.domaines.set(domaines);
      this.combinaisons.set(combinaisons);
      this.metiers.set(metiers);
      this.parcours.set(parcours);
      this.ecoles.set(ecoles);
      this.status.set('ready');
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Impossible de charger les contenus.');
      this.status.set('error');
    }
  }
}
