import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Message affiché quand il n'y a rien à montrer (liste vide, fiche introuvable…). */
@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly heading = input.required<string>();
  readonly message = input('');
  readonly actionLabel = input('');
  readonly actionLink = input('/');
}
