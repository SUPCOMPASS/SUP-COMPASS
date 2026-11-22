import { Injectable, computed, inject, signal } from '@angular/core';
import { QUESTIONS_QUIZ } from '../data/quiz';
import { Critere } from '../models/models';
import { NOTE_NEUTRE } from '../utils/matching';
import { StorageService } from './storage.service';

const CLE = 'quiz.scores';

/**
 * Résultat du quiz : une note (0 à 5) par critère, utilisée pour pré-remplir l'atlas.
 * Stocké dans le navigateur (sans compte requis) ; relu après le 1er rendu pour l'hydratation SSR.
 */
@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly storage = inject(StorageService);
  private restored = false;

  /** Notes par id de critère, ou null tant que le quiz n'a pas été passé. */
  readonly notes = signal<Record<string, number> | null>(null);
  readonly aResultat = computed(() => this.notes() !== null);

  restore(): void {
    if (this.restored) return;
    this.restored = true;
    this.notes.set(this.storage.get<Record<string, number>>(CLE));
  }

  /** Moyenne des réponses par critère ; un critère sans question reste neutre. */
  calculer(reponses: Record<string, number>, criteres: Critere[]): Record<string, number> {
    const resultat: Record<string, number> = {};
    // Si les critères ne sont pas encore chargés depuis l'API, on se base sur ceux des questions.
    const ids = criteres.length ? criteres.map((c) => c.id) : [...new Set(QUESTIONS_QUIZ.map((q) => q.critere))];
    for (const id of ids) {
      const valeurs = QUESTIONS_QUIZ.filter((q) => q.critere === id && q.id in reponses).map((q) => reponses[q.id]);
      resultat[id] = valeurs.length
        ? Math.round(valeurs.reduce((a, b) => a + b, 0) / valeurs.length)
        : NOTE_NEUTRE;
    }
    return resultat;
  }

  enregistrer(notes: Record<string, number>): void {
    this.restored = true;
    this.notes.set(notes);
    this.storage.set(CLE, notes);
  }

  reinitialiser(): void {
    this.notes.set(null);
    this.storage.remove(CLE);
  }
}
