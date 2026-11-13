import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export type NodeType = 'd' | 'c' | 'm'; // d = Domaine, c = Combinaison, m = Métier

export interface MapNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  routeSlug: string;
  summary: string;
}

export interface MapEdge {
  from: string;
  to: string;
}

@Component({
  selector: 'app-domaines',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './domaines.html',
  styleUrl: './domaines.css'
})
export class Domaines {
  readonly nodes: MapNode[] = [
    { id: 'ia', type: 'd', label: 'IA & Data', x: 110, y: 60, routeSlug: 'domaine/ia', summary: 'Analyser et prédire à partir des données.' },
    { id: 'cy', type: 'd', label: 'Cybersécurité', x: 110, y: 160, routeSlug: 'domaine/cy', summary: 'Protéger réseaux et systèmes.' },
    { id: 'em', type: 'd', label: 'Systèmes embarqués', x: 110, y: 260, routeSlug: 'domaine/em', summary: 'Objets connectés, logiciel et matériel.' },
    { id: 'rt', type: 'd', label: 'Réseaux & Télécoms', x: 110, y: 360, routeSlug: 'domaine/rt', summary: '5G, fibre, cœur de réseau.' },

    { id: 'ia-cy', type: 'c', label: 'IA + Cyber', x: 400, y: 110, routeSlug: 'combo/ia-cy', summary: 'Détecter les attaques avec l’apprentissage automatique.' },
    { id: 'em-ia', type: 'c', label: 'Embarqué + IA', x: 400, y: 210, routeSlug: 'combo/em-ia', summary: 'Faire tourner l’IA directement sur l’appareil.' },
    { id: 'rt-cy', type: 'c', label: 'Réseaux + Cyber', x: 400, y: 310, routeSlug: 'combo/rt-cy', summary: 'Sécuriser les infrastructures de télécoms.' },

    { id: 'm1', type: 'm', label: 'Data scientist', x: 690, y: 60, routeSlug: 'metier/m1', summary: 'Transforme les données en décisions.' },
    { id: 'm2', type: 'm', label: 'Ingénieur IA sécurité', x: 690, y: 160, routeSlug: 'metier/m2', summary: 'Conçoit des outils de détection d’intrusion.' },
    { id: 'm3', type: 'm', label: 'Ingénieur Edge AI', x: 690, y: 260, routeSlug: 'metier/m3', summary: 'Déploie des modèles sur des puces à faible énergie.' },
    { id: 'm4', type: 'm', label: 'Architecte sécurité réseau', x: 690, y: 360, routeSlug: 'metier/m4', summary: 'Dessine des réseaux résistants aux attaques.' }
  ];

  readonly edges: MapEdge[] = [
    { from: 'ia', to: 'ia-cy' },
    { from: 'cy', to: 'ia-cy' },
    { from: 'em', to: 'em-ia' },
    { from: 'ia', to: 'em-ia' },
    { from: 'rt', to: 'rt-cy' },
    { from: 'cy', to: 'rt-cy' },
    { from: 'ia', to: 'm1' },
    { from: 'ia-cy', to: 'm2' },
    { from: 'em-ia', to: 'm3' },
    { from: 'rt-cy', to: 'm4' }
  ];

  selectedId = signal<string | null>(null);

  selectedNode = computed<MapNode | null>(() => {
    const id = this.selectedId();
    return id ? this.nodes.find(n => n.id === id) ?? null : null;
  });

  reachableIds = computed<Set<string> | null>(() => {
    const startId = this.selectedId();
    if (!startId) return null;

    const visited = new Set<string>([startId]);
    let changed = true;

    while (changed) {
      changed = false;
      for (const edge of this.edges) {
        if (visited.has(edge.from) && !visited.has(edge.to)) {
          visited.add(edge.to);
          changed = true;
        }
      }
    }
    return visited;
  });

  toggleNode(id: string): void {
    this.selectedId.update(current => (current === id ? null : id));
  }

  getEdgePath(edge: MapEdge): string {
    const source = this.nodes.find(n => n.id === edge.from);
    const target = this.nodes.find(n => n.id === edge.to);
    if (!source || !target) return '';

    const x1 = source.x + 75;
    const x2 = target.x - 75;
    const midX = (x1 + x2) / 2;

    return `M${x1},${source.y} C${midX},${source.y} ${midX},${target.y} ${x2 - 6},${target.y}`;
  }

  isEdgeHighlighted(edge: MapEdge): boolean {
    const reachable = this.reachableIds();
    return !!reachable && reachable.has(edge.from) && reachable.has(edge.to);
  }

  isNodeDimmed(nodeId: string): boolean {
    const reachable = this.reachableIds();
    return !!reachable && !reachable.has(nodeId);
  }

  getTypeLabel(type: NodeType): string {
    switch (type) {
      case 'd': return 'Domaine';
      case 'c': return 'Combinaison';
      case 'm': return 'Métier';
    }
  }
}