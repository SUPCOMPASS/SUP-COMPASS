import { Component, input } from '@angular/core';
import { Parcours } from '../../../core/models/models';
import { EmptyState } from '../empty-state/empty-state';

/** Frise 1A → 2A → 3A d'un domaine ou d'une combinaison. */
@Component({
  selector: 'app-roadmap',
  imports: [EmptyState],
  templateUrl: './roadmap.html',
  styleUrl: './roadmap.css',
})
export class Roadmap {
  readonly steps = input.required<Parcours[]>();
}
