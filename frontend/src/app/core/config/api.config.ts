import { InjectionToken } from '@angular/core';

/**
 * Adresse de l'API consommée par le front.
 * Par défaut : le mock API json-server (dossier `mock-api/`, `npm start`).
 * Pour brancher le vrai backend Express plus tard, il suffit de changer cette valeur
 * (ou de la fournir dans app.config.ts : `{ provide: API_URL, useValue: '…' }`).
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3001',
});
