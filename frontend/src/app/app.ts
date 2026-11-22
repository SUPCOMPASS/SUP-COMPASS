import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from './shared/components/footer/footer';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { AuthService } from './core/services/auth.service';
import { DataService } from './core/services/data.service';
import { QuizService } from './core/services/quiz.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly quiz = inject(QuizService);
  private readonly data = inject(DataService);
  private readonly main = viewChild<ElementRef<HTMLElement>>('main');

  /** Vrai pendant une navigation (barre de progression). */
  protected readonly navigating = signal(false);

  constructor() {
    // Session, quiz et contenus de l'API sont chargés dans le navigateur, après le 1er rendu,
    // pour que l'hydratation retrouve exactement le HTML rendu par le serveur (squelettes de chargement).
    afterNextRender(() => {
      this.auth.restore();
      this.quiz.restore();
      void this.data.load();
    });

    let premiere = true;
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (event instanceof NavigationEnd) {
        this.navigating.set(false);
        // Accessibilité : après un changement de page, le focus revient sur le contenu.
        if (!premiere) this.main()?.nativeElement.focus({ preventScroll: true });
        premiere = false;
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navigating.set(false);
      }
    });
  }
}
