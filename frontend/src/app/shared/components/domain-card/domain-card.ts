import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Carte de présentation d'un domaine (accueil, favoris du profil). */
@Component({
  selector: 'app-domain-card',
  imports: [RouterLink],
  templateUrl: './domain-card.html',
  styleUrl: './domain-card.css',
})
export class DomainCard {
  readonly nom = input.required<string>();
  readonly resume = input.required<string>();
  readonly tags = input<string[]>([]);
  readonly link = input.required<string>();
}
