# SUP'COMPASS — Guide d'exécution et de test (Objectif 4)

Projet Web SUP'COM 2025/2026 — Yassine Affes & Mahmoud Hriz

Ce guide explique comment lancer le site en local et comment vérifier chaque fonctionnalité de l'Objectif 4.
Durée : environ 10 minutes pour l'installation et 15 minutes pour les tests.

---

## 1. Prérequis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | 22 ou plus | `node -v` |
| npm | 10 ou plus | `npm -v` |
| Git | toute version récente | `git --version` |
| Navigateur | Chrome, Firefox ou Edge récent | — |

Aucune base de données n'est nécessaire : le front utilise un **mock API** (json-server) qui simule le backend.

---

## 2. Installation (une seule fois)

```bash
git clone https://github.com/SUPCOMPASS/SUP-COMPASS.git
cd SUP-COMPASS

cd mock-api
npm install

cd ../frontend
npm install
```

---

## 3. Lancement

Il faut **deux terminaux**, ouverts à la racine du projet.

**Terminal 1 : mock API** (à lancer en premier)

```bash
cd mock-api
npm start
```

Résultat attendu : `Mock API SUP'COMPASS : http://localhost:3001 (latence simulée : 400 ms)`.

**Terminal 2 : site Angular**

```bash
cd frontend
npm start
```

Ensuite, ouvrir **http://localhost:4200** dans le navigateur.

### Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Étudiant | `etudiant@supcom.tn` | `etudiant1234` |
| Administrateur | `admin@supcom.tn` | `admin1234` |

### Commandes utiles

| Commande | Dossier | Effet |
|---|---|---|
| `npm run reset` | `mock-api/` | Remet les données de départ (après des essais d'ajout ou de suppression) |
| `MOCK_DELAY=0 npm start` | `mock-api/` | Lance l'API sans latence simulée (sous PowerShell : `$env:MOCK_DELAY=0; npm start`) |
| `npm test` | `frontend/` | Tests unitaires (16 tests, Vitest) |
| `npm run lint` | `frontend/` | Vérification ESLint (TypeScript, Angular, accessibilité) |
| `npm run format:check` | `frontend/` | Vérification du formatage Prettier |
| `npm run build` | `frontend/` | Build de production (SSR et pages pré-rendues) |

---

## 4. Scénario de test manuel

Cocher chaque ligne au fur et à mesure. Le résultat attendu est indiqué entre parenthèses.

### A. Visiteur (sans compte)

- [ ] **Accueil** `/` : un squelette de chargement apparaît brièvement, puis les 3 domaines mis en avant s'affichent.
- [ ] **Carte des domaines** (menu *Domaines*) : cliquer sur « IA & Data » (les combinaisons et métiers liés s'allument en orange, et un panneau d'aperçu s'affiche).
- [ ] **Fiche domaine** (bouton *Voir la fiche*) : les 4 onglets Présentation, Roadmap, Débouchés et Double diplôme fonctionnent, au clic comme avec les flèches du clavier.
- [ ] **Fiche combinaison** : depuis l'onglet *Débouchés*, ouvrir « IA + Cyber ».
- [ ] **Quiz** (menu *Quiz*) : répondre aux 16 questions (le podium des 3 domaines s'affiche).
- [ ] **Atlas** (menu *Atlas*) : il est pré-rempli par le quiz. Bouger un curseur (le classement et le radar changent en direct).
- [ ] **Double diplôme** : filtrer par pays « Canada » (1 école), puis saisir le rang 45 (le résultat change). Ouvrir une fiche école.
- [ ] **Contact** (pied de page) : envoyer un message vide (messages d'erreur sous chaque champ), puis un message valide (« Merci ! Ton message a bien été envoyé. »).
- [ ] **Page 404** : ouvrir `/page-inexistante` (message et lien de retour).
- [ ] **Page protégée** : ouvrir `/profil` (redirection vers la page de connexion).

### B. Étudiant connecté (`etudiant@supcom.tn`)

- [ ] **Mauvais mot de passe** (« E-mail ou mot de passe incorrect. »).
- [ ] **Connexion** avec le bon mot de passe (redirection vers *Mon profil*).
- [ ] **Favori** : ouvrir une fiche domaine et cliquer sur *Ajouter aux favoris* (le bouton devient « ★ Dans mes favoris »).
- [ ] **Sauvegarde** : dans l'Atlas, cliquer sur *Sauvegarder mon profil* (message de confirmation).
- [ ] **Mon profil** : les onglets *Résultats sauvegardés* et *Domaines favoris* contiennent ce qui vient d'être ajouté.
- [ ] **Persistance** : recharger la page (F5). Les données sont toujours là, car elles sont stockées par l'API.
- [ ] **Paramètres** : changer le mot de passe (8 caractères minimum, avec confirmation).
- [ ] **Inscription** : se déconnecter, créer un nouveau compte via *Créer un compte*, puis le supprimer dans *Paramètres*.

### C. Administrateur (`admin@supcom.tn`)

- [ ] Le lien **Admin** apparaît dans la barre de navigation.
- [ ] **Ajouter** un domaine, par exemple « Photonique » (il apparaît dans le tableau, puis sur la carte des domaines).
- [ ] **Modifier** une école, par exemple la date limite (la fiche école est mise à jour).
- [ ] **Supprimer** le domaine ajouté (avec une étape de confirmation).
- [ ] Un étudiant qui ouvre `/admin` est redirigé vers son profil.

### D. Robustesse et UX

- [ ] **API arrêtée** : fermer le terminal 1 et recharger une page (message « Impossible de charger les données » avec un bouton *Réessayer*). Relancer l'API, puis cliquer sur *Réessayer* (le contenu revient).
- [ ] **Responsive** : ouvrir les outils de développement (F12) puis le mode appareil, et tester 390 px (téléphone), 768 px (tablette) et 1280 px. Le menu burger fonctionne et il n'y a aucun défilement horizontal.
- [ ] **Clavier** : naviguer avec Tab, Entrée et Échap. Le lien « Aller au contenu principal » apparaît au premier Tab, et Échap ferme le menu mobile.

---

## 5. Tester l'API directement (optionnel)

Avec le navigateur ou `curl`, le mock API étant lancé :

| Requête | Résultat attendu |
|---|---|
| `GET http://localhost:3001/domaines` | Liste des 6 domaines (JSON) |
| `GET http://localhost:3001/ecoles?pays=France` | Écoles filtrées par pays |
| `GET http://localhost:3001/favoris` (sans jeton) | `401 Connexion requise.` |
| `GET http://localhost:3001/utilisateurs` | `404` (les comptes ne sont jamais exposés) |

Exemple de connexion :

```bash
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" \
     -d "{\"email\":\"etudiant@supcom.tn\",\"password\":\"etudiant1234\"}"
```

La réponse contient `{ token, user }`. Le jeton s'envoie ensuite dans l'en-tête `Authorization: Bearer <token>`.
La liste complète des routes se trouve dans le `README.md` (section *Mock API endpoints*).

---

## 6. Tests automatiques et qualité

Depuis `frontend/` :

```bash
npm test               # 11 fichiers, 16 tests : services (API, auth), algorithme de classement, pages
npm run lint           # attendu : « All files pass linting. »
npm run format:check   # attendu : « All matched files use Prettier code style! »
npm run build          # attendu : build réussi, 11 pages pré-rendues
```

### Scores Lighthouse mesurés (build de production)

| Page | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Accueil `/` | 96 | 100 | 100 | 100 |
| Fiche domaine `/domaines/domaine/ia` | 96 | 100 | 100 | 100 |
| Double diplôme `/double-diplome` | 88 | 100 | 100 | 100 |
| Atlas `/atlas` | 88 | 100 | 100 | 100 |

Pour refaire la mesure : Chrome, F12, onglet *Lighthouse*, mode *Navigation*, puis *Analyser*. Le mesurer en navigation
privée évite que les extensions faussent le résultat.

---

## 7. Problèmes fréquents

| Symptôme | Cause | Solution |
|---|---|---|
| « Le serveur ne répond pas » sur toutes les pages | Mock API non lancé | `cd mock-api && npm start` |
| `EADDRINUSE: 3001` ou `4200` | Port déjà utilisé | Fermer l'ancien terminal, ou relancer l'ordinateur |
| Données bizarres après des essais | Base de démo modifiée | `cd mock-api && npm run reset` |
| Connecté mais « Session expirée » | Base réinitialisée pendant que la session était ouverte | Se reconnecter |
| `ng` introuvable | Dépendances non installées | `cd frontend && npm install` |
