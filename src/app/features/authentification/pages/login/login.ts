import { Component, signal } from '@angular/core';

export type AuthMode = 'login' | 'register' | 'forgot';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  mode = signal<AuthMode>('login');
  email = signal<string>('');
  password = signal<string>('');
  fullName = signal<string>('');
  statusMessage = signal<string | null>(null);

  switchMode(newMode: AuthMode): void {
    this.mode.set(newMode);
    this.statusMessage.set(null);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const currentMode = this.mode();

    if (currentMode === 'login') {
      this.statusMessage.set(`Connexion réussie pour ${this.email() || 'prenom.nom@supcom.tn'} (prêt pour liaison API).`);
    } else if (currentMode === 'register') {
      this.statusMessage.set(`Compte créé pour ${this.fullName() || this.email()} ! Tu peux maintenant te connecter.`);
    } else {
      this.statusMessage.set(`Un lien de réinitialisation a été envoyé à ${this.email()}.`);
    }
  }
}