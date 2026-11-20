import { Component, signal } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';

type FieldErrors = { nom?: string; email?: string; message?: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formulaire de contact validé côté client (envoi simulé en attendant le backend). */
@Component({
  selector: 'app-contact',
  imports: [PageHeader],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly nom = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');
  protected readonly errors = signal<FieldErrors>({});
  protected readonly loading = signal(false);
  protected readonly sent = signal(false);

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!this.nom().trim()) errors.nom = 'Indique ton nom.';
    if (!EMAIL_RE.test(this.email())) errors.email = 'Saisis une adresse e-mail valide.';
    if (this.message().trim().length < 10) errors.message = 'Ton message doit contenir au moins 10 caractères.';
    this.errors.set(errors);
    if (Object.keys(errors).length) return;

    this.loading.set(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    this.loading.set(false);
    this.sent.set(true);
    this.nom.set('');
    this.email.set('');
    this.message.set('');
  }
}
