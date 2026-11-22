import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Réserve une route aux utilisateurs connectés (sinon : connexion, puis retour ici). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  auth.restore();
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
};

/** Réserve une route aux administrateurs. */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  auth.restore();
  if (auth.isAdmin()) return true;
  return auth.isLoggedIn()
    ? router.createUrlTree(['/profil'])
    : router.createUrlTree(['/connexion'], { queryParams: { returnUrl: state.url } });
};
