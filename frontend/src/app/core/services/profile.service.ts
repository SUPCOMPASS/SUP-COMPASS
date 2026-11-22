import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { Favori, ResultatAtlas } from '../models/models';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { LoadStatus } from './data.service';

/**
 * Favoris et résultats d'atlas de l'utilisateur connecté, stockés par l'API (/favoris, /resultats).
 * L'API filtre elle-même par utilisateur grâce au jeton de session.
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  private readonly _favoris = signal<Favori[]>([]);
  private readonly _resultats = signal<ResultatAtlas[]>([]);

  /** Identifiants des domaines favoris. */
  readonly favoris = computed(() => this._favoris().map((f) => f.domaineId));
  /** Résultats, du plus récent au plus ancien. */
  readonly resultats = computed(() =>
    [...this._resultats()].sort((a, b) => b.date.localeCompare(a.date)),
  );
  readonly status = signal<LoadStatus>('loading');
  readonly error = signal('');

  constructor() {
    // Recharge les données à chaque changement d'utilisateur (connexion / déconnexion).
    effect(() => {
      const userId = this.auth.user()?.id;
      untracked(() => (userId ? this.load() : this.vider()));
    });
  }

  async load(): Promise<void> {
    this.status.set('loading');
    this.error.set('');
    try {
      const [favoris, resultats] = await Promise.all([
        this.api.get<Favori[]>('/favoris'),
        this.api.get<ResultatAtlas[]>('/resultats'),
      ]);
      this._favoris.set(favoris);
      this._resultats.set(resultats);
      this.status.set('ready');
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Impossible de charger ton profil.');
      this.status.set('error');
    }
  }

  /** Ajoute ou retire un favori (mise à jour immédiate de l'écran, annulée si l'API échoue). */
  async toggleFavori(domaineId: string): Promise<void> {
    const existant = this._favoris().find((f) => f.domaineId === domaineId);
    const avant = this._favoris();
    try {
      if (existant) {
        this._favoris.set(avant.filter((f) => f !== existant));
        await this.api.delete(`/favoris/${encodeURIComponent(existant.id)}`);
      } else {
        const temporaire: Favori = { id: `tmp-${domaineId}`, domaineId };
        this._favoris.set([...avant, temporaire]);
        const cree = await this.api.post<Favori>('/favoris', { domaineId });
        this._favoris.update((list) => list.map((f) => (f === temporaire ? cree : f)));
      }
    } catch (e) {
      this._favoris.set(avant);
      throw e;
    }
  }

  async saveResultat(scores: number[], top: ResultatAtlas['top']): Promise<void> {
    const cree = await this.api.post<ResultatAtlas>('/resultats', {
      date: new Date().toISOString(),
      scores,
      top,
    });
    this._resultats.update((list) => [cree, ...list]);
  }

  async removeResultat(id: string): Promise<void> {
    await this.api.delete(`/resultats/${encodeURIComponent(id)}`);
    this._resultats.update((list) => list.filter((r) => r.id !== id));
  }

  private vider(): void {
    this._favoris.set([]);
    this._resultats.set([]);
    this.status.set('loading');
  }
}
