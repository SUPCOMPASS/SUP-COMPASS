import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { QuizService } from '../../../../core/services/quiz.service';
import { Domaine } from '../../../../core/models/models';
import { DomaineScore, MAX_NOTE, NOTE_NEUTRE, classerDomaines } from '../../../../core/utils/matching';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

/** Géométrie du radar (repère SVG) */
const CX = 150;
const CY = 150;
const RADIUS = 105;
const LABEL_RADIUS = 125;

@Component({
  selector: 'app-atlas',
  imports: [RouterLink, PageHeader],
  templateUrl: './atlas.html',
  styleUrl: './atlas.css',
})
export class Atlas {
  private readonly data = inject(DataService);
  private readonly profile = inject(ProfileService);
  private readonly quiz = inject(QuizService);
  protected readonly auth = inject(AuthService);

  protected readonly criteres = this.data.criteres.items;

  /** Curseurs déplacés à la main (sur 5) ; tant qu'ils ne le sont pas, on part du quiz, sinon du neutre. */
  protected readonly scores = signal<number[]>([]);
  /** Vrai si l'atlas est pré-rempli par le quiz et que l'utilisateur n'a encore rien modifié. */
  protected readonly depuisQuiz = computed(() => this.quiz.aResultat() && this.scores().length === 0);
  protected readonly saved = signal(false);

  private readonly count = computed(() => this.criteres().length);
  private readonly valeurs = computed(() => {
    const quiz = this.quiz.notes();
    return this.criteres().map((c, i) => this.scores()[i] ?? quiz?.[c.id] ?? NOTE_NEUTRE);
  });

  /** Classement des domaines, recalculé en direct à chaque mouvement de curseur. */
  protected readonly rankedDomaines = computed<DomaineScore[]>(() => classerDomaines(this.valeurs(), this.data.domaines.items()));

  /** Domaine arrivé en tête (pointillés sur le radar). */
  protected readonly topDomaine = computed<Domaine | null>(() => this.rankedDomaines()[0]?.domaine ?? null);

  protected readonly gridPolygons = computed(() =>
    [1, 2, 3, 4, 5].map((niveau) => this.polygon(this.criteres().map(() => niveau))),
  );

  protected readonly axisLabels = computed(() =>
    this.criteres().map((critere, i) => {
      const angle = this.angle(i);
      const cos = Math.cos(angle);
      return {
        label: critere.label,
        x: +(CX + LABEL_RADIUS * cos).toFixed(1),
        y: +(CY + LABEL_RADIUS * Math.sin(angle) + 4).toFixed(1),
        anchor: cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle',
      };
    }),
  );

  protected readonly userPolygon = computed(() => this.polygon(this.valeurs()));
  protected readonly topPolygon = computed(() => this.polygon(this.topDomaine()?.profil ?? []));

  /** Note actuelle du critère n° `index`. */
  protected note(index: number): number {
    return this.valeurs()[index];
  }

  protected updateScore(index: number, event: Event): void {
    const next = [...this.valeurs()];
    next[index] = Number((event.target as HTMLInputElement).value);
    this.saved.set(false);
    this.scores.set(next);
  }

  /** Revient à un atlas vierge (efface le quiz). */
  protected reset(): void {
    this.quiz.reinitialiser();
    this.scores.set([]);
    this.saved.set(false);
  }

  /** Enregistre le profil dans « Mon profil » (utilisateur connecté). */
  protected save(): void {
    const top = this.rankedDomaines().slice(0, 3).map((r) => ({ domaineId: r.domaine.id, match: r.match }));
    this.profile.saveResultat(this.valeurs(), top);
    this.saved.set(true);
  }

  private angle(index: number): number {
    return -Math.PI / 2 + (index * 2 * Math.PI) / Math.max(this.count(), 1);
  }

  private polygon(values: number[]): string {
    return values
      .map((val, i) => {
        const r = (RADIUS * val) / MAX_NOTE;
        return `${(CX + r * Math.cos(this.angle(i))).toFixed(1)},${(CY + r * Math.sin(this.angle(i))).toFixed(1)}`;
      })
      .join(' ');
  }
}
