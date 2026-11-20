import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { ProfilState, ResultatAtlas } from '../models/models';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

const VIDE: ProfilState = { favoris: [], resultats: [] };

/** Favoris et résultats d'atlas de l'utilisateur connecté (stockés par e-mail). */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly auth = inject(AuthService);
  private readonly storage = inject(StorageService);
  private readonly state = signal<ProfilState>(VIDE);

  readonly favoris = computed(() => this.state().favoris);
  readonly resultats = computed(() => this.state().resultats);

  constructor() {
    // Recharge les données à chaque changement d'utilisateur (connexion / déconnexion).
    effect(() => {
      const user = this.auth.user();
      untracked(() => this.state.set(user ? (this.storage.get<ProfilState>(this.cle(user.email)) ?? VIDE) : VIDE));
    });
  }

  toggleFavori(domaineId: string): void {
    const { favoris } = this.state();
    this.maj({ favoris: favoris.includes(domaineId) ? favoris.filter((f) => f !== domaineId) : [...favoris, domaineId] });
  }

  saveResultat(scores: number[], top: ResultatAtlas['top']): void {
    const resultat: ResultatAtlas = { id: String(Date.now()), date: new Date().toISOString(), scores, top };
    this.maj({ resultats: [resultat, ...this.state().resultats] });
  }

  removeResultat(id: string): void {
    this.maj({ resultats: this.state().resultats.filter((r) => r.id !== id) });
  }

  private maj(partiel: Partial<ProfilState>): void {
    const next = { ...this.state(), ...partiel };
    this.state.set(next);
    const user = this.auth.user();
    if (user) this.storage.set(this.cle(user.email), next);
  }

  private cle(email: string): string {
    return `profil.${email}`;
  }
}
