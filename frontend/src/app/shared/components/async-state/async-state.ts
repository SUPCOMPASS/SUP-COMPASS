import { Component, input, output } from '@angular/core';
import { Loader } from '../loader/loader';

/**
 * Affiche le contenu projeté seulement quand les données sont prêtes :
 * squelette (ou spinner) pendant le chargement, message + bouton « Réessayer » en cas d'erreur.
 *
 * Exemple : <app-async-state [status]="data.status()" [error]="data.error()" (retry)="data.load()"> … </app-async-state>
 */
@Component({
  selector: 'app-async-state',
  imports: [Loader],
  templateUrl: './async-state.html',
  styleUrl: './async-state.css',
  // Réserve la hauteur du contenu attendu pendant le chargement (évite que la page « saute »).
  host: { '[style.min-height]': "status() === 'ready' ? null : reserve()" },
})
export class AsyncState {
  readonly status = input.required<'loading' | 'ready' | 'error'>();
  readonly error = input('');
  readonly variant = input<'spinner' | 'skeleton'>('skeleton');
  readonly label = input('Chargement des contenus…');
  readonly lines = input(4);
  /** Hauteur réservée pendant le chargement (ex. '70vh'), pour limiter le décalage de mise en page. */
  readonly reserve = input<string | null>(null);
  readonly retry = output<void>();
}
