import { Signal, WritableSignal, signal } from '@angular/core';

/** Petite collection réactive (signal) : copie locale d'une ressource de l'API, mise à jour après chaque appel. */
export class Collection<T extends { id: string }> {
  private readonly _items: WritableSignal<T[]>;
  readonly items: Signal<T[]>;

  constructor(seed: T[] = []) {
    this._items = signal(seed);
    this.items = this._items.asReadonly();
  }

  /** Remplace tout le contenu (après un chargement depuis l'API). */
  set(items: T[]): void {
    this._items.set(items);
  }

  get(id: string): T | undefined {
    return this._items().find((item) => item.id === id);
  }

  /** Crée l'élément ou le remplace s'il existe déjà. */
  upsert(item: T): void {
    this._items.update((list) =>
      list.some((i) => i.id === item.id)
        ? list.map((i) => (i.id === item.id ? item : i))
        : [...list, item],
    );
  }

  remove(id: string): void {
    this._items.update((list) => list.filter((item) => item.id !== id));
  }

  mutate(fn: (list: T[]) => T[]): void {
    this._items.update(fn);
  }
}
