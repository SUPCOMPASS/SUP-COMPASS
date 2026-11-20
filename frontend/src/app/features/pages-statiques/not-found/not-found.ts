import { Component } from '@angular/core';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

/** Page 404 : message d'erreur et lien de retour vers l'accueil. */
@Component({
  selector: 'app-not-found',
  imports: [EmptyState],
  templateUrl: './not-found.html',
})
export class NotFound {}
