import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PageHeader],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  protected readonly sections = [
    { path: 'domaines', label: 'Domaines' },
    { path: 'combinaisons', label: 'Combinaisons' },
    { path: 'parcours', label: 'Parcours' },
    { path: 'ecoles', label: 'Écoles' },
    { path: 'criteres', label: 'Critères atlas' },
  ];
}
