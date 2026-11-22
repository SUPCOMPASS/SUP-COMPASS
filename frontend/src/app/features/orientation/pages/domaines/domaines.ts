import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { AsyncState } from '../../../../shared/components/async-state/async-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

export type NodeType = 'd' | 'c' | 'm'; // Domaine, Combinaison, Métier
export type MapNode = {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  link: string;
  summary: string;
};
export type MapEdge = { from: string; to: string };

/** Géométrie de la carte SVG */
const COL_X: Record<NodeType, number> = { d: 110, c: 400, m: 690 };
const HALF_WIDTH = 85;
const ROW_STEP = 80;
const TOP = 60;

@Component({
  selector: 'app-domaines',
  imports: [RouterLink, PageHeader, AsyncState],
  templateUrl: './domaines.html',
  styleUrl: './domaines.css',
})
export class Domaines {
  protected readonly data = inject(DataService);

  protected readonly halfWidth = HALF_WIDTH;
  protected readonly selectedId = signal<string | null>(null);

  /** Nœuds construits à partir des données (domaines, combinaisons, métiers). */
  protected readonly nodes = computed<MapNode[]>(() => {
    const domaines = this.data.domaines.items();
    const combos = this.data.combinaisons.items();
    const metiers = this.data.metiers.items();
    const rows = Math.max(domaines.length, combos.length, metiers.length, 1);
    const y = (index: number, count: number) =>
      TOP + index * ROW_STEP + ((rows - count) * ROW_STEP) / 2;

    return [
      ...domaines.map((d, i) => ({
        id: d.id,
        type: 'd' as const,
        label: d.nom,
        x: COL_X.d,
        y: y(i, domaines.length),
        link: `/domaines/domaine/${d.id}`,
        summary: d.resume,
      })),
      ...combos.map((c, i) => ({
        id: c.id,
        type: 'c' as const,
        label: c.nom,
        x: COL_X.c,
        y: y(i, combos.length),
        link: `/domaines/combo/${c.id}`,
        summary: c.resume,
      })),
      // Un métier renvoie vers la fiche du domaine / de la combinaison dont il est issu.
      ...metiers.map((m, i) => ({
        id: m.id,
        type: 'm' as const,
        label: m.nom,
        x: COL_X.m,
        y: y(i, metiers.length),
        link: this.data.lienCible(m.sources[0] ?? ''),
        summary: m.resume,
      })),
    ];
  });

  protected readonly viewHeight = computed(
    () => Math.max(...this.nodes().map((n) => n.y), TOP) + 50,
  );

  protected readonly edges = computed<MapEdge[]>(() => [
    ...this.data.combinaisons
      .items()
      .flatMap((c) => c.domaines.map((d) => ({ from: d, to: c.id }))),
    ...this.data.metiers.items().flatMap((m) => m.sources.map((s) => ({ from: s, to: m.id }))),
  ]);

  protected readonly selectedNode = computed<MapNode | null>(() => {
    const id = this.selectedId();
    return id ? (this.nodes().find((n) => n.id === id) ?? null) : null;
  });

  /** Éléments atteignables depuis le nœud sélectionné (chemins possibles). */
  protected readonly reachableIds = computed<Set<string> | null>(() => {
    const start = this.selectedId();
    if (!start) return null;
    const visited = new Set<string>([start]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const edge of this.edges()) {
        if (visited.has(edge.from) && !visited.has(edge.to)) {
          visited.add(edge.to);
          changed = true;
        }
      }
    }
    return visited;
  });

  protected toggleNode(id: string): void {
    this.selectedId.update((current) => (current === id ? null : id));
  }

  protected edgePath(edge: MapEdge): string {
    const source = this.nodes().find((n) => n.id === edge.from);
    const target = this.nodes().find((n) => n.id === edge.to);
    if (!source || !target) return '';
    const x1 = source.x + HALF_WIDTH;
    const x2 = target.x - HALF_WIDTH;
    const midX = (x1 + x2) / 2;
    return `M${x1},${source.y} C${midX},${source.y} ${midX},${target.y} ${x2 - 6},${target.y}`;
  }

  protected isEdgeHighlighted(edge: MapEdge): boolean {
    const r = this.reachableIds();
    return !!r && r.has(edge.from) && r.has(edge.to);
  }

  protected isNodeDimmed(nodeId: string): boolean {
    const r = this.reachableIds();
    return !!r && !r.has(nodeId);
  }

  protected typeLabel(type: NodeType): string {
    return type === 'd' ? 'Domaine' : type === 'c' ? 'Combinaison' : 'Métier';
  }
}
