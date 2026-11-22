/**
 * Mock API de SUP'COMPASS (Objectif 4) — json-server + quelques routes personnalisées.
 *
 *  - Contenus publics (lecture libre, écriture réservée aux admins) :
 *      /criteres /domaines /combinaisons /metiers /parcours /ecoles
 *  - Authentification simulée (jeton aléatoire, mot de passe haché) : /auth/*
 *  - Données personnelles (jeton requis, filtrées par utilisateur) : /favoris /resultats
 *  - Formulaire de contact : POST /messages (lecture réservée aux admins)
 *
 * Les données sont lues dans db.json, créé à partir de db.seed.json au premier lancement
 * (`npm run reset` pour revenir aux données de départ).
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const jsonServer = require('json-server');

const PORT = Number(process.env.PORT ?? 3001);
/** Latence simulée (ms) pour voir les états de chargement du front. */
const DELAY = Number(process.env.MOCK_DELAY ?? 400);
const SEED_FILE = path.join(__dirname, 'db.seed.json');
const DB_FILE = path.join(__dirname, 'db.json');

if (process.argv.includes('--reset') || !fs.existsSync(DB_FILE)) {
  fs.copyFileSync(SEED_FILE, DB_FILE);
  console.info('db.json initialisé depuis db.seed.json');
  if (process.argv.includes('--reset')) process.exit(0);
}

const server = jsonServer.create();
const router = jsonServer.router(DB_FILE);
const db = router.db; // instance lowdb (API lodash)

const CONTENUS = ['criteres', 'domaines', 'combinaisons', 'metiers', 'parcours', 'ecoles'];
const PRIVEES = ['favoris', 'resultats'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Utilitaires ----------

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return `${salt}:${crypto.scryptSync(password, salt, 32).toString('hex')}`;
}

function checkPassword(password, stored) {
  const [salt, hash] = String(stored).split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 32);
  return crypto.timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

/** Utilisateur sans son mot de passe (ce qui est renvoyé au front). */
const publicUser = ({ motDePasse, ...user }) => user;

function openSession(user) {
  const token = crypto.randomBytes(24).toString('hex');
  db.get('sessions').push({ id: token, userId: user.id, creeLe: new Date().toISOString() }).write();
  return { token, user: publicUser(user) };
}

/** Utilisateur correspondant au jeton « Authorization: Bearer … », ou null. */
function currentUser(req) {
  const match = /^Bearer (.+)$/.exec(req.get('Authorization') ?? '');
  if (!match) return null;
  const session = db.get('sessions').find({ id: match[1] }).value();
  return session ? (db.get('utilisateurs').find({ id: session.userId }).value() ?? null) : null;
}

const fail = (res, status, error) => res.status(status).json({ error });

/** Première ressource du chemin : "/domaines/ia" → "domaines". */
const resourceOf = (req) => req.path.split('/')[1] ?? '';
const idOf = (req) => decodeURIComponent(req.path.split('/')[2] ?? '');

// ---------- Middlewares globaux ----------

server.use(jsonServer.defaults({ logger: process.env.NODE_ENV !== 'test' })); // CORS, logs, no-cache
server.use(jsonServer.bodyParser);
server.use((_req, _res, next) => setTimeout(next, DELAY));

// Ressources internes : jamais exposées telles quelles.
server.use(['/utilisateurs', '/sessions'], (_req, res) => fail(res, 404, 'Ressource introuvable.'));

// ---------- Authentification ----------

server.post('/auth/register', (req, res) => {
  const nom = String(req.body.nom ?? '').trim();
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const password = String(req.body.password ?? '');
  if (!nom) return fail(res, 400, 'Le nom est obligatoire.');
  if (!EMAIL_RE.test(email)) return fail(res, 400, 'Adresse e-mail invalide.');
  if (password.length < 8) return fail(res, 400, 'Le mot de passe doit contenir au moins 8 caractères.');
  if (db.get('utilisateurs').find({ email }).value()) return fail(res, 409, 'Un compte existe déjà avec cette adresse.');

  const user = { id: `u-${crypto.randomUUID()}`, nom, email, role: 'user', motDePasse: hashPassword(password) };
  db.get('utilisateurs').push(user).write();
  res.status(201).json(openSession(user));
});

server.post('/auth/login', (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase();
  const user = db.get('utilisateurs').find({ email }).value();
  if (!user || !checkPassword(String(req.body.password ?? ''), user.motDePasse)) {
    return fail(res, 401, 'E-mail ou mot de passe incorrect.');
  }
  res.json(openSession(user));
});

// Réponse identique que le compte existe ou non (pas de fuite d'information).
server.post('/auth/forgot', (req, res) => {
  if (!EMAIL_RE.test(String(req.body.email ?? ''))) return fail(res, 400, 'Adresse e-mail invalide.');
  res.status(202).json({ message: 'Si un compte existe, un lien de réinitialisation a été envoyé.' });
});

// Toutes les autres routes /auth/* demandent une session.
server.use('/auth', (req, res, next) => {
  const user = currentUser(req);
  if (!user) return fail(res, 401, 'Session expirée, reconnecte-toi.');
  req.user = user;
  next();
});

server.get('/auth/me', (req, res) => res.json(publicUser(req.user)));

server.post('/auth/logout', (req, res) => {
  const token = req.get('Authorization').slice('Bearer '.length);
  db.get('sessions').remove({ id: token }).write();
  res.status(204).end();
});

server.patch('/auth/password', (req, res) => {
  const password = String(req.body.password ?? '');
  if (password.length < 8) return fail(res, 400, 'Le mot de passe doit contenir au moins 8 caractères.');
  db.get('utilisateurs').find({ id: req.user.id }).assign({ motDePasse: hashPassword(password) }).write();
  res.status(204).end();
});

server.delete('/auth/me', (req, res) => {
  const userId = req.user.id;
  for (const table of ['favoris', 'resultats', 'sessions']) db.get(table).remove({ userId }).write();
  db.get('utilisateurs').remove({ id: userId }).write();
  res.status(204).end();
});

// ---------- Droits d'accès ----------

server.use((req, res, next) => {
  const resource = resourceOf(req);
  const user = currentUser(req);

  // Contenus : lecture publique, écriture admin.
  if (CONTENUS.includes(resource)) {
    if (req.method === 'GET') return next();
    if (!user) return fail(res, 401, 'Connexion requise.');
    if (user.role !== 'admin') return fail(res, 403, 'Action réservée aux administrateurs.');
    return next();
  }

  // Favoris / résultats : chaque utilisateur ne voit et ne modifie que les siens.
  if (PRIVEES.includes(resource)) {
    if (!user) return fail(res, 401, 'Connexion requise.');
    const id = idOf(req);
    if (id) {
      const row = db.get(resource).find({ id }).value();
      if (!row || row.userId !== user.id) return fail(res, 404, 'Élément introuvable.');
    }
    if (req.method === 'GET') req.query.userId = user.id;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) req.body.userId = user.id;
    return next();
  }

  // Contact : envoi public validé, lecture admin.
  if (resource === 'messages') {
    if (req.method === 'POST') {
      const { nom = '', email = '', message = '' } = req.body;
      if (!String(nom).trim() || !EMAIL_RE.test(String(email)) || String(message).trim().length < 10) {
        return fail(res, 400, 'Formulaire de contact incomplet.');
      }
      req.body = { nom: String(nom).trim(), email: String(email).trim(), message: String(message).trim(),
        date: new Date().toISOString() };
      return next();
    }
    if (user?.role === 'admin') return next();
    return fail(res, 403, 'Action réservée aux administrateurs.');
  }

  next();
});

// ---------- Suppressions en cascade (admin) ----------

/** Retire tout ce qui dépend d'un domaine ou d'une combinaison (parcours, métiers). */
function nettoyerCible(id) {
  db.get('parcours').remove({ cible: id }).write();
  db.get('metiers').each((m) => { m.sources = m.sources.filter((s) => s !== id); }).write();
  db.get('metiers').remove((m) => m.sources.length === 0).write();
}

server.delete('/domaines/:id', (req, res) => {
  const { id } = req.params;
  if (!db.get('domaines').find({ id }).value()) return fail(res, 404, 'Domaine introuvable.');
  const combos = db.get('combinaisons').filter((c) => c.domaines.includes(id)).map('id').value();
  combos.forEach(nettoyerCible);
  db.get('combinaisons').remove((c) => combos.includes(c.id)).write();
  nettoyerCible(id);
  db.get('ecoles').each((e) => { e.domaines = e.domaines.filter((d) => d !== id); }).write();
  db.get('favoris').remove({ domaineId: id }).write();
  db.get('domaines').remove({ id }).write();
  res.status(200).json({});
});

server.delete('/combinaisons/:id', (req, res) => {
  const { id } = req.params;
  if (!db.get('combinaisons').find({ id }).value()) return fail(res, 404, 'Combinaison introuvable.');
  nettoyerCible(id);
  db.get('combinaisons').remove({ id }).write();
  res.status(200).json({});
});

// Création avec un identifiant déjà pris → 409 (json-server renverrait une erreur 500).
server.post('/:resource', (req, res, next) => {
  const { resource } = req.params;
  if (CONTENUS.includes(resource) && req.body.id && db.get(resource).find({ id: req.body.id }).value()) {
    return fail(res, 409, `Un élément avec l'identifiant « ${req.body.id} » existe déjà.`);
  }
  next();
});

// ---------- Routes REST générées par json-server ----------

server.use(router);

server.listen(PORT, () => {
  console.info(`Mock API SUP'COMPASS : http://localhost:${PORT} (latence simulée : ${DELAY} ms)`);
  console.info('Comptes de démo : admin@supcom.tn / admin1234 · etudiant@supcom.tn / etudiant1234');
});
