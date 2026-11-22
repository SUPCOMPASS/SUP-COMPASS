import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { AsyncState } from '../../../../shared/components/async-state/async-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-fiche-ecole',
  imports: [RouterLink, PageHeader, EmptyState, AsyncState],
  templateUrl: './fiche-ecole.html',
  styleUrl: './fiche-ecole.css',
})
export class FicheEcole {
  protected readonly data = inject(DataService);
  private readonly title = inject(Title);

  readonly id = input.required<string>();

  protected readonly ecole = computed(() => this.data.ecoles.get(this.id()));
  /** Domaines liés à l'école (ceux qui existent encore). */
  protected readonly domaines = computed(() =>
    (this.ecole()?.domaines ?? []).flatMap((d) => {
      const domaine = this.data.domaines.get(d);
      return domaine ? [domaine] : [];
    }),
  );

  constructor() {
    effect(() => {
      if (this.data.status() !== 'ready') return;
      this.title.setTitle(`${this.ecole()?.nom ?? 'École introuvable'} | SUP'COMPASS`);
    });
  }
}
