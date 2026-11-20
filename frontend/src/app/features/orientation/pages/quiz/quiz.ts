import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QUESTIONS_QUIZ, REPONSES_QUIZ } from '../../../../core/data/quiz';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { QuizService } from '../../../../core/services/quiz.service';
import { NOTE_NEUTRE, classerDomaines } from '../../../../core/utils/matching';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-quiz',
  imports: [RouterLink, PageHeader],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  private readonly data = inject(DataService);
  private readonly quiz = inject(QuizService);
  private readonly profile = inject(ProfileService);
  protected readonly auth = inject(AuthService);

  protected readonly questions = QUESTIONS_QUIZ;
  protected readonly choix = REPONSES_QUIZ;

  protected readonly etape = signal(0);
  protected readonly reponses = signal<Record<string, number>>({});
  protected readonly termine = signal(false);
  protected readonly sauvegarde = signal(false);

  protected readonly question = computed(() => this.questions[this.etape()]);
  protected readonly progression = computed(() => Math.round((this.etape() / this.questions.length) * 100));
  protected readonly reponseCourante = computed(() => this.reponses()[this.question().id]);

  /** Notes calculées dans l'ordre des critères de l'atlas. */
  private readonly notes = computed(() => {
    const criteres = this.data.criteres.items();
    const parCritere = this.quiz.calculer(this.reponses(), criteres);
    return criteres.map((c) => parCritere[c.id] ?? NOTE_NEUTRE);
  });

  protected readonly classement = computed(() => classerDomaines(this.notes(), this.data.domaines.items()));
  protected readonly podium = computed(() => this.classement().slice(0, 3));

  protected repondre(valeur: number): void {
    this.reponses.update((r) => ({ ...r, [this.question().id]: valeur }));
  }

  protected suivant(): void {
    if (this.reponseCourante() === undefined) return;
    if (this.etape() < this.questions.length - 1) {
      this.etape.update((e) => e + 1);
    } else {
      this.terminer();
    }
  }

  protected precedent(): void {
    if (this.etape() > 0) this.etape.update((e) => e - 1);
  }

  protected recommencer(): void {
    this.reponses.set({});
    this.etape.set(0);
    this.termine.set(false);
    this.sauvegarde.set(false);
  }

  /** Remplit l'atlas automatiquement avec les notes calculées. */
  private terminer(): void {
    this.quiz.enregistrer(this.quiz.calculer(this.reponses(), this.data.criteres.items()));
    this.termine.set(true);
  }

  protected sauvegarder(): void {
    const top = this.podium().map((r) => ({ domaineId: r.domaine.id, match: r.match }));
    this.profile.saveResultat(this.notes(), top);
    this.sauvegarde.set(true);
  }
}
