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
})
export class AsyncState {
  readonly status = input.required<'loading' | 'ready' | 'error'>();
  readonly error = input('');
  readonly variant = input<'spinner' | 'skeleton'>('skeleton');
  readonly label = input('Chargement des contenus…');
  readonly lines = input(4);
  readonly retry = output<void>();
}
