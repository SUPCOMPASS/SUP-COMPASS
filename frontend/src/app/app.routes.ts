import { Routes } from '@angular/router';

import { Home } from './features/home/pages/home/home';
import { Domaines } from './features/orientation/pages/domaines/domaines';
import { Atlas } from './features/orientation/pages/atlas/atlas';
import { Ecoles } from './features/double-diplome/pages/ecoles/ecoles';
import { Login } from './features/authentification/pages/login/login';

// Nouveau composant pour tester l'API PostgreSQL
import { Domaines as DomainesApi } from './features/domaines/domaines';

export const routes: Routes = [

    { path: '', component: Home },

    // Page existante d'orientation
    { path: 'domaines', component: Domaines },

    // Page de démonstration API
    { path: 'domaines-api', component: DomainesApi },

    { path: 'atlas', component: Atlas },

    { path: 'double-diplome', component: Ecoles },

    { path: 'connexion', component: Login },

    { path: '**', redirectTo: '' }

];