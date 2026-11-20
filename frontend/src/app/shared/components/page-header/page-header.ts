import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type Crumb = { label: string; link?: string };

/** En-tête de page : fil d'Ariane + titre + sous-titre (+ actions projetées à droite). */
@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly heading = input.required<string>();
  readonly subtitle = input('');
  readonly crumbs = input<Crumb[]>([]);
}
