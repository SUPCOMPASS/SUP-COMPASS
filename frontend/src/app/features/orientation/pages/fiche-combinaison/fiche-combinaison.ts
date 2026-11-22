import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { AsyncState } from '../../../../shared/components/async-state/async-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Roadmap } from '../../../../shared/components/roadmap/roadmap';
import { TabDef, Tabs } from '../../../../shared/components/tabs/tabs';

/** Même modèle que la fiche domaine, pour une combinaison de deux domaines (ex. IA + Cyber). */
@Component({
  selector: 'app-fiche-combinaison',
  imports: [RouterLink, PageHeader, Tabs, Roadmap, EmptyState, AsyncState],
  templateUrl: './fiche-combinaison.html',
  styleUrl: './fiche-combinaison.css',
})
export class FicheCombinaison {
  protected readonly data = inject(DataService);
  private readonly title = inject(Title);

  readonly id = input.required<string>();

  protected readonly tabs: TabDef[] = [
    { id: 'presentation', label: 'Prérequis' },
    { id: 'roadmap', label: 'Roadmap 1A / 2A / 3A' },
    { id: 'metiers', label: 'Métiers' },
  ];
  protected readonly activeTab = signal('presentation');

  protected readonly combinaison = computed(() => this.data.combinaisons.get(this.id()));
  protected readonly parcours = computed(() => this.data.parcoursDe(this.id()));
  /** Domaines qui composent la combinaison (ceux qui existent encore). */
  protected readonly domaines = computed(() =>
    (this.combinaison()?.domaines ?? []).flatMap((d) => {
      const domaine = this.data.domaines.get(d);
      return domaine ? [domaine] : [];
    }),
  );
  protected readonly metiers = computed(() => this.data.metiers.items().filter((m) => m.sources.includes(this.id())));

  constructor() {
    effect(() => {
      if (this.data.status() !== 'ready') return;
      this.title.setTitle(`${this.combinaison()?.nom ?? 'Combinaison introuvable'} | SUP'COMPASS`);
    });
  }
}
