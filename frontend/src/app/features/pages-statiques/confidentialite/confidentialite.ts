import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-confidentialite',
  imports: [RouterLink, PageHeader],
  templateUrl: './confidentialite.html',
  styleUrl: './confidentialite.css',
})
export class Confidentialite {}
