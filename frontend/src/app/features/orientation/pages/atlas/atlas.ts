import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { Domaine } from '../../../../core/models/models';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

export type DomaineScore = { domaine: Domaine; match: number };

/** Géométrie du radar (repère SVG) */
const CX = 150;
const CY = 150;
const RADIUS = 105;
const LABEL_RADIUS = 125;
const MAX_NOTE = 5;

@Component({
  selector: 'app-atlas',
  imports: [RouterLink, PageHeader],
  templateUrl: './atlas.html',
  styleUrl: './atlas.css',
})
export class Atlas {
  private readonly data = inject(DataService);
  private readonly profile = inject(ProfileService);
  protected readonly auth = inject(AuthService);

  protected readonly criteres = this.data.criteres.items;

  /** Valeur de chaque curseur (sur 5), 3 = neutre au départ. */
  protected readonly scores = signal<number[]>([]);
  protected readonly saved = signal(false);

  private readonly count = computed(() => this.criteres().length);
  private readonly valeurs = computed(() => this.criteres().map((_, i) => this.scores()[i] ?? 3));

  /** Classement des domaines, recalculé en direct à chaque mouvement de curseur. */
  protected readonly rankedDomaines = computed<DomaineScore[]>(() => {
    const current = this.valeurs();
    const max = MAX_NOTE * Math.max(this.count(), 1);
    return this.data.domaines
      .items()
      .map((domaine) => {
        const ecart = current.reduce((sum, note, i) => sum + Math.abs(note - (domaine.profil[i] ?? 0)), 0);
        return { domaine, match: Math.round(100 * (1 - ecart / max)) };
      })
      .sort((a, b) => b.match - a.match);
  });

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
