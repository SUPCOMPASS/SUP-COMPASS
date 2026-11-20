import { Component, computed, signal } from '@angular/core';

export interface EcolePartenaire {
  id: number;
  name: string;
  pays: string;
  langue: string;
  rangMin: number;
  rangMax: number;
  doms: string[];
  deadline: string;
}

@Component({
  selector: 'app-ecoles',
  standalone: true,
  imports: [],
  templateUrl: './ecoles.html',
  styleUrl: './ecoles.css'
})
export class Ecoles {
  readonly paysList: string[] = ['all', 'France', 'Italie', 'Canada', 'Allemagne'];

  readonly domainesFilter = [
    { id: 'all', label: 'Tous' },
    { id: 'ia', label: 'IA & Data' },
    { id: 'cy', label: 'Cybersécurité' },
    { id: 'em', label: 'Systèmes embarqués' },
    { id: 'rt', label: 'Réseaux & Télécoms' }
  ];

  readonly ecoles: EcolePartenaire[] = [
    { id: 0, name: 'Télécom Paris', pays: 'France', langue: 'Français', rangMin: 1, rangMax: 15, doms: ['ia', 'cy', 'rt'], deadline: 'Février 2027' },
    { id: 1, name: 'IMT Atlantique', pays: 'France', langue: 'Français', rangMin: 15, rangMax: 30, doms: ['ia', 'em', 'rt'], deadline: 'Mars 2027' },
    { id: 2, name: 'Polytechnique Montréal', pays: 'Canada', langue: 'Français', rangMin: 10, rangMax: 30, doms: ['ia', 'lg', 'rt'], deadline: 'Janvier 2027' },
    { id: 3, name: 'Politecnico di Torino', pays: 'Italie', langue: 'Anglais', rangMin: 20, rangMax: 40, doms: ['em', 'rf'], deadline: 'Avril 2027' },
    { id: 4, name: 'TU Munich', pays: 'Allemagne', langue: 'Anglais', rangMin: 1, rangMax: 20, doms: ['cy', 'rf'], deadline: 'Mai 2027' },
    { id: 5, name: 'INSA Lyon', pays: 'France', langue: 'Français', rangMin: 30, rangMax: 50, doms: ['em', 'lg'], deadline: 'Mars 2027' }
  ];

  selectedPays = signal<string>('all');
  selectedDomaine = signal<string>('all');
  rangInput = signal<string>('');

  filteredEcoles = computed<EcolePartenaire[]>(() => {
    const pays = this.selectedPays();
    const dom = this.selectedDomaine();
    const rang = parseInt(this.rangInput(), 10);

    return this.ecoles.filter(ecole => {
      const matchPays = pays === 'all' || ecole.pays === pays;
      const matchDom = dom === 'all' || ecole.doms.includes(dom);
      const matchRang = isNaN(rang) || (rang >= ecole.rangMin && rang <= ecole.rangMax);
      return matchPays && matchDom && matchRang;
    });
  });

  onRangChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.rangInput.set(val);
  }
}