import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-a-propos',
  imports: [RouterLink, PageHeader],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.css',
})
export class APropos {}
