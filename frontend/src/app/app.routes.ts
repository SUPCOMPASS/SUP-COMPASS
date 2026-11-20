import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { Domaines } from './features/orientation/pages/domaines/domaines';
import { Atlas } from './features/orientation/pages/atlas/atlas';
import { Ecoles } from './features/double-diplome/pages/ecoles/ecoles';
import { Login } from './features/authentification/pages/login/login';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'domaines', component: Domaines },
    { path: 'atlas', component: Atlas },
    { path: 'double-diplome', component: Ecoles },
    { path: 'connexion', component: Login },
    { path: '**', redirectTo: '' }
];