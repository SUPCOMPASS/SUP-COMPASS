import { Injectable, computed, inject, signal } from '@angular/core';
import { Utilisateur } from '../models/models';
import { StorageService } from './storage.service';

const SESSION_KEY = 'session';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Seul ce compte obtient le rôle administrateur (mode démo). */
export const ADMIN_DEMO_EMAIL = 'admin@supcom.tn';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Authentification SIMULÉE (mode démo, sans backend) : e-mail valide + mot de passe de 8 caractères
 * minimum ouvrent une session stockée dans le navigateur. À remplacer par /api/auth (JWT) plus tard.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private restored = false;

  readonly user = signal<Utilisateur | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  /** Recharge la session depuis le navigateur (après le 1er rendu, et dans les guards). */
  restore(): void {
    if (this.restored) return;
    this.restored = true;
    this.user.set(this.storage.get<Utilisateur>(SESSION_KEY));
  }

  async login(email: string, password: string): Promise<Utilisateur> {
    this.valider(email, password);
    await wait(600);
    return this.ouvrirSession(email.split('@')[0].replace(/[._-]+/g, ' '), email);
  }

  async register(nom: string, email: string, password: string): Promise<Utilisateur> {
    this.valider(email, password);
    await wait(700);
    return this.ouvrirSession(nom.trim(), email);
  }

  async requestReset(email: string): Promise<void> {
    if (!EMAIL_RE.test(email)) throw new Error('Adresse e-mail invalide.');
    await wait(600);
  }

  async changePassword(newPassword: string): Promise<void> {
    if (newPassword.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
    await wait(600);
  }

  logout(): void {
    this.storage.remove(SESSION_KEY);
    this.user.set(null);
  }

  async deleteAccount(): Promise<void> {
    const current = this.user();
    await wait(600);
    if (current) this.storage.remove(`profil.${current.email}`);
    this.logout();
  }

  private valider(email: string, password: string): void {
    if (!EMAIL_RE.test(email)) throw new Error('Adresse e-mail invalide.');
    if (password.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
  }

  private ouvrirSession(nom: string, email: string): Utilisateur {
    const user: Utilisateur = {
      id: email.toLowerCase(),
      nom: nom || email,
      email: email.toLowerCase(),
      role: email.toLowerCase() === ADMIN_DEMO_EMAIL ? 'admin' : 'user',
    };
    this.storage.set(SESSION_KEY, user);
    this.user.set(user);
    return user;
  }
}
