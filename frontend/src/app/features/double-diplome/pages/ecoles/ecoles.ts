import { Component, computed, inject, signal } from '@angular/core';
import { DataService } from '../../../../core/services/data.service';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SchoolCard } from '../../../../shared/components/school-card/school-card';

const TOUS = 'all';

@Component({
  selector: 'app-ecoles',
  imports: [PageHeader, SchoolCard, EmptyState],
  templateUrl: './ecoles.html',
  styleUrl: './ecoles.css',
})
export class Ecoles {
  private readonly data = inject(DataService);

  protected readonly tous = TOUS;

  /** Options de filtre déduites des données (elles suivent les ajouts faits dans l'admin). */
  protected readonly paysList = computed(() => [...new Set(this.data.ecoles.items().map((e) => e.pays))].sort());
  protected readonly langues = computed(() => [...new Set(this.data.ecoles.items().map((e) => e.langue))].sort());
  protected readonly domainesFilter = this.data.domaines.items;

  protected readonly selectedPays = signal<string>(TOUS);
  protected readonly selectedLangue = signal<string>(TOUS);
  protected readonly selectedDomaine = signal<string>(TOUS);
  protected readonly rangInput = signal('');

  protected readonly filteredEcoles = computed(() => {
    const pays = this.selectedPays();
    const langue = this.selectedLangue();
    const dom = this.selectedDomaine();
    const rang = parseInt(this.rangInput(), 10);

    return this.data.ecoles.items().filter((ecole) => {
      const matchPays = pays === TOUS || ecole.pays === pays;
      const matchLangue = langue === TOUS || ecole.langue === langue;
      const matchDom = dom === TOUS || ecole.domaines.includes(dom);
      const matchRang = isNaN(rang) || (rang >= ecole.rangMin && rang <= ecole.rangMax);
      return matchPays && matchLangue && matchDom && matchRang;
    });
  });

  protected onRangChange(event: Event): void {
    this.rangInput.set((event.target as HTMLInputElement).value);
  }

  protected reset(): void {
    this.selectedPays.set(TOUS);
    this.selectedLangue.set(TOUS);
    this.selectedDomaine.set(TOUS);
    this.rangInput.set('');
  }
}
