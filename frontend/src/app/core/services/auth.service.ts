import { Injectable, computed, inject, signal } from '@angular/core';
import { Utilisateur } from '../models/models';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

const SESSION_KEY = 'session';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Session = { token: string; user: Utilisateur };

/**
 * Authentification via le mock API (/auth/*) : l'API vérifie le mot de passe et renvoie un jeton
 * de session, gardé dans le navigateur et ajouté à chaque requête par l'intercepteur.
 * Le rôle (user / admin) vient de l'API, plus du front.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  private readonly session = signal<Session | null>(null);
  private restored = false;

  readonly user = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  /** Recharge la session depuis le navigateur (après le 1er rendu, et dans les guards). */
  restore(): void {
    if (this.restored) return;
    this.restored = true;
    const saved = this.storage.get<Session>(SESSION_KEY);
    if (!saved?.token) return;
    this.session.set(saved);
    // Vérifie en arrière-plan que le jeton est toujours valide (sinon l'intercepteur ferme la session).
    this.api.get<Utilisateur>('/auth/me').then(
      (user) => this.ouvrirSession({ token: saved.token, user }),
      () => undefined,
    );
  }

  async login(email: string, password: string): Promise<Utilisateur> {
    this.valider(email, password);
    const session = await this.api.post<Session>('/auth/login', { email: email.trim(), password });
    return this.ouvrirSession(session);
  }

  async register(nom: string, email: string, password: string): Promise<Utilisateur> {
    this.valider(email, password);
    const session = await this.api.post<Session>('/auth/register', {
      nom: nom.trim(),
      email: email.trim(),
      password,
    });
    return this.ouvrirSession(session);
  }

  async requestReset(email: string): Promise<void> {
    if (!EMAIL_RE.test(email)) throw new Error('Adresse e-mail invalide.');
    await this.api.post('/auth/forgot', { email: email.trim() });
  }

  async changePassword(password: string): Promise<void> {
    if (password.length < 8)
      throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
    await this.api.patch('/auth/password', { password });
  }

  /** Déconnexion : le jeton est invalidé côté API, la session locale est effacée tout de suite. */
  logout(): void {
    if (this.token()) this.api.post('/auth/logout', {}).catch(() => undefined);
    this.clearSession();
  }

  async deleteAccount(): Promise<void> {
    await this.api.delete('/auth/me');
    this.clearSession();
  }

  /** Efface la session locale (déconnexion, ou jeton refusé par l'API). */
  clearSession(): void {
    this.storage.remove(SESSION_KEY);
    this.session.set(null);
  }

  private valider(email: string, password: string): void {
    if (!EMAIL_RE.test(email)) throw new Error('Adresse e-mail invalide.');
    if (password.length < 8)
      throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
  }

  private ouvrirSession(session: Session): Utilisateur {
    this.storage.set(SESSION_KEY, session);
    this.session.set(session);
    return session.user;
  }
}
