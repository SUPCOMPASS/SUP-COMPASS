import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { Roadmap } from '../../../../shared/components/roadmap/roadmap';
import { SchoolCard } from '../../../../shared/components/school-card/school-card';
import { TabDef, Tabs } from '../../../../shared/components/tabs/tabs';

@Component({
  selector: 'app-fiche-domaine',
  imports: [RouterLink, PageHeader, Tabs, Roadmap, SchoolCard, EmptyState],
  templateUrl: './fiche-domaine.html',
  styleUrl: './fiche-domaine.css',
})
export class FicheDomaine {
  private readonly data = inject(DataService);
  private readonly title = inject(Title);
  protected readonly auth = inject(AuthService);
  protected readonly profile = inject(ProfileService);

  /** Paramètre d'URL `:id` (withComponentInputBinding). */
  readonly id = input.required<string>();

  protected readonly tabs: TabDef[] = [
    { id: 'presentation', label: 'Présentation' },
    { id: 'roadmap', label: 'Roadmap 1A / 2A / 3A' },
    { id: 'debouches', label: 'Débouchés et combinaisons' },
    { id: 'double-diplome', label: 'Double diplôme' },
  ];
  protected readonly activeTab = signal('presentation');

  protected readonly domaine = computed(() => this.data.domaines.get(this.id()));
  protected readonly parcours = computed(() => this.data.parcoursDe(this.id()));
  protected readonly combinaisons = computed(() => this.data.combinaisonsDe(this.id()));
  protected readonly ecoles = computed(() => this.data.ecolesDe(this.id()));
  protected readonly estFavori = computed(() => this.profile.favoris().includes(this.id()));

  constructor() {
    effect(() => this.title.setTitle(`${this.domaine()?.nom ?? 'Domaine introuvable'} | SUP'COMPASS`));
  }

  protected toggleFavori(): void {
    this.profile.toggleFavori(this.id());
  }
}
