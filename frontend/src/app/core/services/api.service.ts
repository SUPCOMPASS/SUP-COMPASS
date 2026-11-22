import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { API_URL } from '../config/api.config';

type Params = Record<string, string | number | boolean>;

/** Erreur d'API avec un message lisible par l'utilisateur et le code HTTP. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/**
 * Point d'accès unique à l'API REST (mock API json-server pour l'instant).
 * Renvoie des promesses pour s'utiliser simplement avec async / await dans les services.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_URL);

  get<T>(path: string, params?: Params): Promise<T> {
    return this.send(
      this.http.get<T>(this.url(path), {
        params: params && new HttpParams({ fromObject: params }),
      }),
    );
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.send(this.http.post<T>(this.url(path), body));
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.send(this.http.put<T>(this.url(path), body));
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.send(this.http.patch<T>(this.url(path), body));
  }

  delete(path: string): Promise<void> {
    return this.send(this.http.delete<void>(this.url(path)));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private async send<T>(request: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request);
    } catch (error) {
      throw toApiError(error);
    }
  }
}

/** Traduit une erreur HTTP en message compréhensible. */
export function toApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError(error instanceof Error ? error.message : 'Une erreur est survenue.', 0);
  }
  if (error.status === 0) {
    return new ApiError(
      'Le serveur ne répond pas. Vérifie que le mock API est lancé (npm start dans mock-api/).',
      0,
    );
  }
  const message =
    typeof error.error?.error === 'string' ? error.error.error : `Erreur ${error.status}.`;
  return new ApiError(message, error.status);
}
