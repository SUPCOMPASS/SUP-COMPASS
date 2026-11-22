import { Component, computed, inject, input, signal } from '@angular/core';
import { Collection } from '../../../../core/services/collection';
import { DataService, Ressource } from '../../../../core/services/data.service';
import { AsyncState } from '../../../../shared/components/async-state/async-state';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

type Row = { id: string } & Record<string, unknown>;
type FieldKind = 'text' | 'textarea' | 'number' | 'list' | 'lines' | 'numbers' | 'select';
type Field = { key: string; label: string; kind: FieldKind; options?: string[]; hint?: string };

type SectionConfig = {
  titre: string;
  singulier: string;
  colonnes: string[];
  fields: Field[];
  /** Calcule l'identifiant d'un nouvel élément. */
  idFrom: (values: Record<string, string>) => string;
};

const slug = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const CONFIGS: Record<string, SectionConfig> = {
  domaines: {
    titre: 'Domaines', singulier: 'domaine', colonnes: ['nom', 'resume'],
    idFrom: (v) => slug(v['nom']),
    fields: [
      { key: 'nom', label: 'Nom', kind: 'text' },
      { key: 'resume', label: 'Résumé', kind: 'text' },
      { key: 'description', label: 'Description', kind: 'textarea' },
      { key: 'prerequis', label: 'Prérequis', kind: 'list', hint: 'Séparés par des virgules' },
      { key: 'competences', label: 'Compétences', kind: 'list', hint: 'Séparées par des virgules' },
      { key: 'debouches', label: 'Débouchés', kind: 'list', hint: 'Séparés par des virgules' },
      { key: 'profil', label: 'Profil atlas', kind: 'numbers', hint: 'Une note de 0 à 5 par critère, séparées par des virgules' },
    ],
  },
  combinaisons: {
    titre: 'Combinaisons', singulier: 'combinaison', colonnes: ['nom', 'domaines'],
    idFrom: (v) => slug(v['nom']),
    fields: [
      { key: 'nom', label: 'Nom', kind: 'text' },
      { key: 'domaines', label: 'Domaines (identifiants)', kind: 'list', hint: 'Ex. ia, cy' },
      { key: 'resume', label: 'Résumé', kind: 'text' },
      { key: 'prerequis', label: 'Prérequis', kind: 'list', hint: 'Séparés par des virgules' },
      { key: 'debouches', label: 'Débouchés', kind: 'list', hint: 'Séparés par des virgules' },
    ],
  },
  parcours: {
    titre: 'Parcours', singulier: 'étape de parcours', colonnes: ['cible', 'annee', 'titre'],
    idFrom: (v) => `${slug(v['cible'])}-${v['annee'].toLowerCase()}`,
    fields: [
      { key: 'cible', label: 'Domaine ou combinaison (identifiant)', kind: 'text' },
      { key: 'annee', label: 'Année', kind: 'select', options: ['1A', '2A', '3A'] },
      { key: 'titre', label: 'Titre', kind: 'text' },
      { key: 'contenu', label: 'Contenu', kind: 'lines', hint: 'Un élément par ligne' },
    ],
  },
  ecoles: {
    titre: 'Écoles', singulier: 'école', colonnes: ['nom', 'pays', 'langue', 'deadline'],
    idFrom: (v) => slug(v['nom']),
    fields: [
      { key: 'nom', label: 'Nom', kind: 'text' },
      { key: 'pays', label: 'Pays', kind: 'text' },
      { key: 'langue', label: 'Langue', kind: 'text' },
      { key: 'rangMin', label: 'Rang minimum', kind: 'number' },
      { key: 'rangMax', label: 'Rang maximum', kind: 'number' },
      { key: 'domaines', label: 'Domaines (identifiants)', kind: 'list', hint: 'Ex. ia, cy' },
      { key: 'deadline', label: 'Date limite', kind: 'text' },
      { key: 'programme', label: 'Programme', kind: 'text' },
      { key: 'duree', label: 'Durée', kind: 'text' },
      { key: 'conditions', label: 'Conditions d’admission', kind: 'lines', hint: 'Une condition par ligne' },
      { key: 'siteWeb', label: 'Site officiel', kind: 'text' },
    ],
  },
  criteres: {
    titre: 'Critères atlas', singulier: 'critère', colonnes: ['label', 'type'],
    idFrom: (v) => slug(v['label']),
    fields: [
      { key: 'label', label: 'Libellé', kind: 'text' },
      { key: 'type', label: 'Type', kind: 'select', options: ['interet', 'disposition'] },
    ],
  },
};

/**
 * Gestion générique (liste + ajout / modification / suppression) pilotée par la route `data.section`.
 * Chaque action appelle l'API (POST / PUT / DELETE) ; l'API vérifie que l'utilisateur est admin.
 */
@Component({
  selector: 'app-admin-section',
  imports: [EmptyState, AsyncState],
  templateUrl: './admin-section.html',
  styleUrl: './admin-section.css',
})
export class AdminSection {
  protected readonly data = inject(DataService);

  readonly section = input<string>('domaines');

  protected readonly config = computed(() => CONFIGS[this.section()] ?? CONFIGS['domaines']);
  protected readonly rows = computed(() => this.collection().items());

  /** Élément en cours d'édition : id existant, 'new' pour une création, null si le formulaire est fermé. */
  protected readonly editing = signal<string | null>(null);
  protected readonly values = signal<Record<string, string>>({});
  protected readonly error = signal('');
  protected readonly pendingDelete = signal<string | null>(null);
  /** Vrai pendant un appel à l'API (boutons désactivés). */
  protected readonly busy = signal(false);
  /** Erreur d'une suppression (affichée au-dessus du tableau). */
  protected readonly listError = signal('');
  protected readonly notice = signal('');

  private ressource(): Ressource {
    return (this.section() in CONFIGS ? this.section() : 'domaines') as Ressource;
  }

  private collection(): Collection<Row> {
    return this.data.collection(this.ressource()) as Collection<Row>;
  }

  /** Valeur d'une cellule du tableau (tableaux joints par des virgules). */
  protected cell(row: Row, key: string): string {
    const value = row[key];
    return Array.isArray(value) ? value.join(', ') : String(value ?? '');
  }

  protected startNew(): void {
    this.reset();
    this.editing.set('new');
    this.values.set(this.defaults());
  }

  protected startEdit(row: Row): void {
    this.reset();
    this.editing.set(row.id);
    const v: Record<string, string> = {};
    for (const f of this.config().fields) {
      const raw = row[f.key];
      v[f.key] = Array.isArray(raw) ? raw.join(f.kind === 'lines' ? '\n' : ', ') : String(raw ?? '');
    }
    this.values.set(v);
  }

  protected cancel(): void {
    this.editing.set(null);
    this.reset();
  }

  protected setValue(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.values.update((v) => ({ ...v, [key]: value }));
  }

  protected async save(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) return;
    const v = this.values();
    const cfg = this.config();
    const vide = cfg.fields.find((f) => f.kind !== 'list' && f.kind !== 'lines' && f.kind !== 'numbers' && !v[f.key]?.trim());
    if (vide) {
      this.error.set(`Le champ « ${vide.label} » est obligatoire.`);
      return;
    }

    const id = this.editing() === 'new' ? cfg.idFrom(v) : (this.editing() as string);
    if (!id) {
      this.error.set('Impossible de générer un identifiant à partir de ces valeurs.');
      return;
    }
    if (this.editing() === 'new' && this.collection().get(id)) {
      this.error.set(`Un élément avec l’identifiant « ${id} » existe déjà.`);
      return;
    }

    // On part de l'élément existant pour conserver les champs non éditables (ex. miseAJour d'une école).
    const row: Row = { ...(this.collection().get(id) ?? {}), id };
    for (const f of cfg.fields) row[f.key] = this.convert(f, v[f.key] ?? '');
    if (this.section() === 'domaines') row['profil'] = this.padProfil(row['profil'] as number[]);
    if (this.section() === 'ecoles') row['miseAJour'] = new Date().toISOString().slice(0, 10);

    const creation = this.editing() === 'new';
    this.busy.set(true);
    this.error.set('');
    try {
      await this.data.save(this.ressource(), row, creation);
      this.cancel();
      this.notice.set(creation ? `« ${id} » a été ajouté.` : `« ${id} » a été modifié.`);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'L’enregistrement a échoué.');
    } finally {
      this.busy.set(false);
    }
  }

  protected askDelete(id: string): void {
    this.pendingDelete.set(id);
  }

  protected async confirmDelete(id: string): Promise<void> {
    // Pour les domaines / combinaisons, l'API supprime aussi en cascade (parcours, métiers, liens des écoles).
    this.busy.set(true);
    this.listError.set('');
    try {
      await this.data.remove(this.ressource(), id);
      this.pendingDelete.set(null);
      this.notice.set(`« ${id} » a été supprimé.`);
    } catch (e) {
      this.listError.set(e instanceof Error ? e.message : 'La suppression a échoué.');
    } finally {
      this.busy.set(false);
    }
  }

  private reset(): void {
    this.error.set('');
    this.listError.set('');
    this.notice.set('');
    this.pendingDelete.set(null);
  }

  private defaults(): Record<string, string> {
    const v: Record<string, string> = {};
    for (const f of this.config().fields) v[f.key] = f.kind === 'select' ? (f.options?.[0] ?? '') : '';
    return v;
  }

  private convert(field: Field, raw: string): unknown {
    switch (field.kind) {
      case 'number':
        return Number(raw) || 0;
      case 'list':
        return raw.split(',').map((s) => s.trim()).filter(Boolean);
      case 'lines':
        return raw.split('\n').map((s) => s.trim()).filter(Boolean);
      case 'numbers':
        return raw.split(',').map((s) => Math.min(5, Math.max(0, Number(s.trim()) || 0)));
      default:
        return raw.trim();
    }
  }

  /** Complète (ou tronque) le profil pour qu'il ait une note par critère de l'atlas. */
  private padProfil(profil: number[]): number[] {
    return this.data.criteres.items().map((_, i) => profil[i] ?? 0);
  }
}
