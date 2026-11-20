import { Component, computed, input } from '@angular/core';

/** État de chargement : spinner centré ou squelette (lignes grisées animées). */
@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  readonly variant = input<'spinner' | 'skeleton'>('spinner');
  readonly label = input('Chargement…');
  readonly lines = input(3);

  protected readonly rows = computed(() => Array.from({ length: this.lines() }, (_, i) => i));
}
