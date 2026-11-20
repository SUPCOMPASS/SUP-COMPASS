import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DataService } from '../../../../core/services/data.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { DomainCard } from '../../../../shared/components/domain-card/domain-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { TabDef, Tabs } from '../../../../shared/components/tabs/tabs';

@Component({
  selector: 'app-profil',
  imports: [DatePipe, RouterLink, PageHeader, Tabs, DomainCard, EmptyState],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private readonly router = inject(Router);
  private readonly data = inject(DataService);
  protected readonly auth = inject(AuthService);
  protected readonly profile = inject(ProfileService);

  protected readonly tabs: TabDef[] = [
    { id: 'resultats', label: 'Résultats sauvegardés' },
    { id: 'favoris', label: 'Domaines favoris' },
    { id: 'parametres', label: 'Paramètres' },
  ];
  protected readonly activeTab = signal('resultats');

  /** Domaines favoris (ceux qui existent encore). */
  protected readonly favoris = computed(() =>
    this.profile.favoris().flatMap((id) => {
      const domaine = this.data.domaines.get(id);
      return domaine ? [domaine] : [];
    }),
  );

  // Changement de mot de passe (simulé)
  protected readonly newPassword = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly pwdStatus = signal<{ text: string; error: boolean } | null>(null);
  protected readonly pwdLoading = signal(false);

  // Suppression du compte (confirmation en 2 étapes)
  protected readonly confirmDelete = signal(false);
  protected readonly deleteLoading = signal(false);

  protected nomDomaine(id: string): string {
    return this.data.domaines.get(id)?.nom ?? id;
  }

  protected async changePassword(event: Event): Promise<void> {
    event.preventDefault();
    if (this.newPassword() !== this.confirmPassword()) {
      this.pwdStatus.set({ text: 'Les deux mots de passe ne correspondent pas.', error: true });
      return;
    }
    this.pwdLoading.set(true);
    try {
      await this.auth.changePassword(this.newPassword());
      this.pwdStatus.set({ text: 'Mot de passe modifié (simulation).', error: false });
      this.newPassword.set('');
      this.confirmPassword.set('');
    } catch (e) {
      this.pwdStatus.set({ text: e instanceof Error ? e.message : 'Une erreur est survenue.', error: true });
    } finally {
      this.pwdLoading.set(false);
    }
  }

  protected async deleteAccount(): Promise<void> {
    this.deleteLoading.set(true);
    await this.auth.deleteAccount();
    await this.router.navigateByUrl('/');
  }
}
