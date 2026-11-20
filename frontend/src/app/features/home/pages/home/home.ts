import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { DomainCard } from '../../../../shared/components/domain-card/domain-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DomainCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly data = inject(DataService);

  /** Les 3 premiers domaines sont mis en avant sur l'accueil. */
  protected readonly vedettes = computed(() => this.data.domaines.items().slice(0, 3));
}
