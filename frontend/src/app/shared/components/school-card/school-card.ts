import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ecole } from '../../../core/models/models';

/** Carte d'une école partenaire (liste double diplôme, fiche domaine). */
@Component({
  selector: 'app-school-card',
  imports: [RouterLink],
  templateUrl: './school-card.html',
  styleUrl: './school-card.css',
})
export class SchoolCard {
  readonly ecole = input.required<Ecole>();
}
