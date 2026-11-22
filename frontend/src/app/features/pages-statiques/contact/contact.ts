import { Component, inject, signal } from '@angular/core';
import { MessageContact } from '../../../core/models/models';
import { ApiService } from '../../../core/services/api.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';

type FieldErrors = { nom?: string; email?: string; message?: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formulaire de contact validé côté client puis envoyé à l'API (POST /messages). */
@Component({
  selector: 'app-contact',
  imports: [PageHeader],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly api = inject(ApiService);

  protected readonly nom = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');
  protected readonly errors = signal<FieldErrors>({});
  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly sendError = signal('');

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!this.nom().trim()) errors.nom = 'Indique ton nom.';
    if (!EMAIL_RE.test(this.email())) errors.email = 'Saisis une adresse e-mail valide.';
    if (this.message().trim().length < 10) errors.message = 'Ton message doit contenir au moins 10 caractères.';
    this.errors.set(errors);
    if (Object.keys(errors).length) return;

    this.loading.set(true);
    this.sent.set(false);
    this.sendError.set('');
    try {
      const message: MessageContact = { nom: this.nom().trim(), email: this.email().trim(), message: this.message().trim() };
      await this.api.post('/messages', message);
      this.sent.set(true);
      this.nom.set('');
      this.email.set('');
      this.message.set('');
    } catch (e) {
      this.sendError.set(e instanceof Error ? e.message : 'L’envoi a échoué.');
    } finally {
      this.loading.set(false);
    }
  }
}
