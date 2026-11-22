import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Structure d'un domaine SUPCOMPASS
export type Domaine = {
  id: number;
  nom: string;
  description: string;
  created_at?: string;
  updated_at?: string;
};

@Injectable({
  providedIn: 'root',
})
export class DomainesService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/domaines';

  // Récupérer tous les domaines
  getDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(this.apiUrl);
  }

  // Récupérer un domaine par son ID
  getDomaineById(id: number): Observable<Domaine> {
    return this.http.get<Domaine>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un domaine
  createDomaine(domaine: { nom: string; description: string }): Observable<Domaine> {
    return this.http.post<Domaine>(this.apiUrl, domaine);
  }

  // Modifier un domaine
  updateDomaine(id: number, domaine: Partial<Domaine>): Observable<Domaine> {
    return this.http.patch<Domaine>(`${this.apiUrl}/${id}`, domaine);
  }

  // Supprimer un domaine
  deleteDomaine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
