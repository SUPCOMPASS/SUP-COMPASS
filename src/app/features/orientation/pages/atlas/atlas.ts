import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface DomaineProfil {
  id: string;
  name: string;
  values: number[];
}

export interface DomaineScore {
  domaine: DomaineProfil;
  match: number;
}

@Component({
  selector: 'app-atlas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './atlas.html',
  styleUrl: './atlas.css'
})
export class Atlas {
  readonly criteria: string[] = [
    'Matériel',
    'Maths',
    'Équipe',
    'Concret',
    'Code',
    'Créativité',
    'Rigueur',
    'Recherche'
  ];

  readonly domaines: DomaineProfil[] = [
    { id: 'ia', name: 'IA & Data', values: [1, 5, 3, 2, 5, 4, 3, 5] },
    { id: 'cy', name: 'Cybersécurité', values: [2, 3, 3, 3, 4, 3, 5, 3] },
    { id: 'em', name: 'Systèmes embarqués', values: [5, 3, 3, 5, 4, 3, 4, 2] },
    { id: 'rt', name: 'Réseaux & Télécoms', values: [4, 3, 4, 4, 3, 2, 4, 2] },
    { id: 'rf', name: 'Radiofréquences', values: [5, 5, 2, 4, 2, 3, 5, 4] },
    { id: 'lg', name: 'Cloud & Logiciel', values: [1, 2, 4, 2, 5, 5, 3, 2] }
  ];

  // Valeurs initiales des 8 curseurs (sur 5)
  scores = signal<number[]>([3, 3, 3, 3, 3, 3, 3, 3]);

  // Classement des domaines recalculé en direct à chaque mouvement de curseur
  rankedDomaines = computed<DomaineScore[]>(() => {
    const current = this.scores();
    return this.domaines
      .map(domaine => {
        let diffSum = 0;
        for (let i = 0; i < 8; i++) {
          diffSum += Math.abs(current[i] - domaine.values[i]);
        }
        const match = Math.round(100 * (1 - diffSum / 40));
        return { domaine, match };
      })
      .sort((a, b) => b.match - a.match);
  });

  // Domaine arrivé en tête (affiché en pointillés sur le radar)
  topDomaine = computed<DomaineProfil>(() => this.rankedDomaines()[0].domaine);

  // Polygones de grille du radar (niveaux 1 à 5)
  readonly gridPolygons: string[] = [1, 2, 3, 4, 5].map(level =>
    this.buildPolygonPoints([level, level, level, level, level, level, level, level], 105)
  );

  // Coordonnées des 8 libellés autour du radar
  readonly axisLabels = this.criteria.map((label, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 4;
    return {
      label,
      x: +(150 + 130 * Math.cos(angle)).toFixed(1),
      y: +(153 + 130 * Math.sin(angle)).toFixed(1)
    };
  });

  // Polygone orange de l'étudiant
  userPolygon = computed<string>(() => this.buildPolygonPoints(this.scores(), 105));

  // Polygone pointillé bleu marine du meilleur domaine
  topDomainePolygon = computed<string>(() =>
    this.buildPolygonPoints(this.topDomaine().values, 105)
  );

  updateScore(index: number, event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.scores.update(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  private buildPolygonPoints(values: number[], radius: number): string {
    return values
      .map((val, i) => {
        const angle = -Math.PI / 2 + (i * Math.PI) / 4;
        const x = (150 + ((radius * val) / 5) * Math.cos(angle)).toFixed(1);
        const y = (150 + ((radius * val) / 5) * Math.sin(angle)).toFixed(1);
        return `${x},${y}`;
      })
      .join(' ');
  }
}