import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

/** Fournisseurs communs aux tests : routeur vide + HttpClient simulé (aucun appel réseau réel). */
export const testProviders = [provideRouter([]), provideHttpClient(), provideHttpClientTesting()];
