import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Domaine,
  DomainesService
} from '../../core/services/domaines.service';

@Component({
  selector: 'app-domaines',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './domaines.html',
  styleUrl: './domaines.css'
})
export class Domaines implements OnInit {

  domaines: Domaine[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  // Formulaire
  nouveauDomaine = {
    nom: '',
    description: ''
  };

  constructor(
    private domainesService: DomainesService
  ) { }

  ngOnInit(): void {
    this.chargerDomaines();
  }

  // GET
  chargerDomaines(): void {

    this.loading = true;
    this.errorMessage = '';

    this.domainesService.getDomaines().subscribe({

      next: (data) => {
        this.domaines = data;
        this.loading = false;
      },

      error: (error) => {
        console.error('Erreur API :', error);

        this.errorMessage =
          'Impossible de récupérer les domaines. Vérifiez le serveur Express.';

        this.loading = false;
      }

    });
  }

  // POST
  ajouterDomaine(): void {

    if (
      !this.nouveauDomaine.nom.trim() ||
      !this.nouveauDomaine.description.trim()
    ) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.domainesService
      .createDomaine(this.nouveauDomaine)
      .subscribe({

        next: () => {

          this.successMessage = 'Domaine ajouté avec succès !';

          this.nouveauDomaine = {
            nom: '',
            description: ''
          };

          this.chargerDomaines();

        },

        error: (error) => {
          console.error(error);
          this.errorMessage = 'Erreur lors de la création.';
        }

      });
  }

  // PATCH
  modifierDomaine(domaine: Domaine): void {

    const nouveauNom = prompt(
      'Nouveau nom :',
      domaine.nom
    );

    if (nouveauNom === null || !nouveauNom.trim()) {
      return;
    }

    this.domainesService.updateDomaine(
      domaine.id,
      { nom: nouveauNom.trim() }
    ).subscribe({

      next: () => {
        this.successMessage = 'Domaine modifié avec succès !';
        this.chargerDomaines();
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erreur lors de la modification.';
      }

    });
  }

  // DELETE
  supprimerDomaine(id: number): void {

    const confirmation = confirm(
      'Voulez-vous vraiment supprimer ce domaine ?'
    );

    if (!confirmation) {
      return;
    }

    this.domainesService.deleteDomaine(id).subscribe({

      next: () => {
        this.successMessage = 'Domaine supprimé avec succès !';
        this.chargerDomaines();
      },

      error: (error) => {
        console.error(error);
        this.errorMessage = 'Erreur lors de la suppression.';
      }

    });
  }

}