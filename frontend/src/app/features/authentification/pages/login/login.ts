import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

export type AuthMode = 'login' | 'register' | 'forgot';
type FieldErrors = { nom?: string; email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Connexion, inscription et mot de passe oublié : le mode vient de la route (`data.mode`). */
@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = input<AuthMode>('login');
  /** Page à rejoindre après connexion (?returnUrl=…). */
  readonly returnUrl = input<string>();

  protected readonly fullName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly errors = signal<FieldErrors>({});
  protected readonly status = signal<{ text: string; error: boolean } | null>(null);
  protected readonly loading = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.loading() || !this.validate()) return;

    this.loading.set(true);
    this.status.set(null);
    try {
      switch (this.mode()) {
        case 'login':
          await this.auth.login(this.email(), this.password());
          await this.router.navigateByUrl(this.destination());
          break;
        case 'register':
          await this.auth.register(this.fullName(), this.email(), this.password());
          await this.router.navigateByUrl(this.destination());
          break;
        case 'forgot':
          await this.auth.requestReset(this.email());
          this.status.set({ text: `Un lien de réinitialisation a été envoyé à ${this.email()}.`, error: false });
          break;
      }
    } catch (e) {
      this.status.set({ text: e instanceof Error ? e.message : 'Une erreur est survenue.', error: true });
    } finally {
      this.loading.set(false);
    }
  }

  /** Validation côté client avec messages par champ. */
  private validate(): boolean {
    const errors: FieldErrors = {};
    if (this.mode() === 'register' && !this.fullName().trim()) errors.nom = 'Indique ton nom complet.';
    if (!EMAIL_RE.test(this.email())) errors.email = 'Saisis une adresse e-mail valide.';
    if (this.mode() !== 'forgot' && this.password().length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  /** Redirection sûre : uniquement vers une page interne du site. */
  private destination(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/profil';
  }
}
