import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  readonly domains = [
    {
      name: 'IA & Data',
      description:
        'Analyser les données, développer des modèles intelligents et créer des systèmes prédictifs.',
      jobs: ['Data Scientist', 'Ingénieur ML'],
      link: '/domaines'
    },

    {
      name: 'Cybersécurité',
      description:
        'Protéger les réseaux, les applications et les systèmes informatiques contre les cyberattaques.',
      jobs: ['Analyste SOC', 'Pentester'],
      link: '/domaines'
    },

    {
      name: 'Systèmes embarqués',
      description:
        'Concevoir des solutions combinant matériel, logiciel et objets connectés.',
      jobs: ['Ingénieur embarqué', 'Concepteur IoT'],
      link: '/domaines'
    }
  ];

}