import { Component, input, model } from '@angular/core';

export type TabDef = { id: string; label: string };

/**
 * Onglets accessibles (rôles ARIA tablist/tab, flèches clavier).
 * Le bouton a l'id `tab-<id>` ; le panneau associé doit avoir l'id `panel-<id>`.
 */
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  readonly tabs = input.required<TabDef[]>();
  readonly label = input('Sections');
  /** Onglet actif (liaison bidirectionnelle `[(active)]`). */
  readonly active = model.required<string>();

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const count = this.tabs().length;
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % count;
    else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else return;

    event.preventDefault();
    this.active.set(this.tabs()[next].id);
    const boutons = (
      event.currentTarget as HTMLElement
    ).parentElement?.querySelectorAll<HTMLElement>('[role="tab"]');
    boutons?.[next]?.focus();
  }
}
