# 🎓 SUPCOMPASS
### Academic & Professional Orientation Platform

SUPCOMPASS is a web platform designed primarily for **SUP'COM students**, helping them explore academic opportunities, discover professional careers, and make informed decisions about their academic and professional future.

The project aims to centralize useful information about academic domains, specializations, educational institutions, professions, and possible career pathways.

It is an open and evolving project intended to welcome future contributors who wish to improve the platform, update its information, or introduce new features.

---

## 🎯 Target Users

- **SUP'COM Students:** Explore academic specializations, educational opportunities, and professional careers.
- **Other Students:** Access structured academic and professional orientation information.
- **Administrators:** Manage platform information and maintain its content.
- **Future Contributors:** Improve the application, update information, fix issues, and develop new functionalities.

---

## ✨ Main Features

The platform is organized around the following functional modules:

| Module | Description |
|---|---|
| Authentication | User registration, login, and account management. |
| Academic Domains | Explore academic fields and specializations. |
| Professional Careers | Discover professions, career opportunities, and required skills. |
| Educational Institutions | Explore universities and educational institutions. |
| Combinations | Understand relationships between academic domains and careers. |
| Orientation | Help students explore suitable academic and professional directions. |
| Pathways | Discover possible academic and professional journeys. |
| Favorites | Save interesting information for later consultation. |
| Administration | Manage users and platform information. |

*Note: Some modules are still under development. Their implementation and integration will progress throughout the project.*

---

## 🛠️ Technologies & Dependencies

SUPCOMPASS uses the following technologies:

| Component | Technology | Purpose |
|---|---|---|
| Frontend | Angular | User interface and navigation |
| Language | TypeScript | Frontend and backend development |
| Backend | Node.js | Server-side execution |
| Framework | Express.js | REST API development |
| Database | PostgreSQL | Persistent data storage |
| Database Driver | pg / pg-pool | PostgreSQL connectivity |
| Configuration | dotenv | Environment variables |
| Authentication | JWT / bcrypt | Authentication and password security |
| Version Control | Git / GitHub | Collaboration and source code management |

### Development Tools

- Visual Studio Code: Code editor.
- pgAdmin 4: Database administration.
- Postman: API testing.
- Git: Version control.
- GitHub: Repository hosting and collaboration.
- Figma: Interface design and prototyping.

### Backend Dependencies

The backend dependencies are managed through `backend/package.json`.

The principal database and configuration packages currently include:

- `pg`: PostgreSQL client.
- `pg-pool`: Database connection pooling.
- `dotenv`: Environment configuration.
- `@types/pg`: PostgreSQL TypeScript definitions.

Other dependencies are managed through npm and the backend package files.

---

## 🏗️ Project Architecture

SUPCOMPASS follows a client-server architecture:

```text
             SUPCOMPASS
                  |
        +---------+---------+
        |                   |
     FRONTEND            BACKEND
     Angular          Node.js / Express
        |                   |
        +------ REST API ----+
                            |
                       PostgreSQL
                         Database
```

**Frontend:** Displays information, manages navigation, and communicates with the backend.

**Backend:** Handles HTTP requests, business logic, authentication, and database operations.

**Database:** Stores user accounts and the platform's academic and professional information.

---

## 📂 Project Structure

```text
SUPCOMPASS/
│
├── frontend/              # Angular application
│
├── mock-api/              # Mock REST API (json-server) used by the frontend — Objectif 4
│   ├── db.seed.json       # Initial data (domains, schools, demo accounts…)
│   └── server.js          # json-server + simulated auth, access rules, cascade deletes
│
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── middleware/    # Request and error handling
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── domaines/
│   │   │   ├── metiers/
│   │   │   ├── combinaisons/
│   │   │   ├── parcours/
│   │   │   ├── orientation/
│   │   │   ├── ecoles/
│   │   │   └── favoris/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/        # Database structure changes
│   └── seeds/             # Initial database data
│
├── documentation/         # Additional project documentation
│
├── .gitignore
└── README.md
```

Each backend module is responsible for a specific business functionality. The administration module contains its own controllers, routes, services, and validators.

---

## 🗄️ Database

The project uses **PostgreSQL**.

Database name:

```text
supcompass
```

The initial migration is:

```text
database/migrations/001_create_users.sql
```

It creates the initial `users` table with:

- UUID identifier.
- First and last name.
- Unique email.
- Hashed password.
- User role (`student` or `admin`).
- Creation and update timestamps.

Database changes must be introduced through migration files.

Use pgAdmin 4 or PostgreSQL tools to manage the database.

---

## ⚙️ Installation & Setup

### Prerequisites

Install the following tools before starting:

- Node.js and npm.
- Angular CLI.
- PostgreSQL.
- pgAdmin 4 (recommended).
- Git.
- Visual Studio Code.

### 1. Clone the Repository

```bash
git clone https://github.com/SUPCOMPASS/SUP-COMPASS.git

cd SUP-COMPASS
```

### 2. Configure the Database

Create a PostgreSQL database named:

```sql
CREATE DATABASE supcompass;
```

Execute the initial migration:

```text
database/migrations/001_create_users.sql
```

Make sure PostgreSQL is running.

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file using the provided example configuration:

```env
PORT=3000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/supcompass

JWT_SECRET=YOUR_RANDOM_SECRET

JWT_EXPIRES_IN=1d
```

Replace the example credentials with your local configuration.

**Never commit `.env` or expose database credentials and secret keys.**

### 4. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

### 5. Install the Mock API (Objectif 4)

Until the Express/PostgreSQL backend is complete, the frontend reads and writes all its data
through a **mock REST API** built with [json-server](https://github.com/typicode/json-server).

```bash
cd mock-api
npm install
```

---

## ▶️ Running the Application

### Frontend + Mock API (current version — Objectif 4)

Two terminals:

```bash
# Terminal 1 — mock API on http://localhost:3001
cd mock-api
npm start

# Terminal 2 — Angular app on http://localhost:4200
cd frontend
npm start
```

Demo accounts:

| Email | Password | Role |
|---|---|---|
| `etudiant@supcom.tn` | `etudiant1234` | user (favorites, saved atlas results) |
| `admin@supcom.tn` | `admin1234` | admin (admin area: CRUD on all contents) |

Useful commands:

| Command (in `mock-api/`) | Description |
|---|---|
| `npm start` | Start the mock API (port `3001`, ~400 ms simulated latency) |
| `npm run reset` | Restore the initial data (`db.json` ← `db.seed.json`) |
| `MOCK_DELAY=0 npm start` | Start without simulated latency |

If the mock API is not running, every page shows an error message with a **Retry** button.

#### Mock API endpoints

| Route | Access | Description |
|---|---|---|
| `GET /criteres`, `/domaines`, `/combinaisons`, `/metiers`, `/parcours`, `/ecoles` (+ `/:id`) | Public | Site contents (json-server filters work, e.g. `/ecoles?pays=France`) |
| `POST` / `PUT` / `PATCH` / `DELETE` on the routes above | Admin | Admin area. Deleting a domain or combination also deletes what depends on it |
| `POST /auth/register`, `POST /auth/login` | Public | Returns `{ token, user }`; passwords are stored hashed (scrypt) |
| `POST /auth/forgot` | Public | Simulated reset email (same answer whether the account exists or not) |
| `GET /auth/me`, `PATCH /auth/password`, `POST /auth/logout`, `DELETE /auth/me` | Logged in | Session, password change, logout, account deletion |
| `GET` / `POST` / `DELETE /favoris`, `/resultats` | Logged in | Favorites and saved atlas results — each user only sees their own |
| `POST /messages` | Public | Contact form (`GET` is admin only) |

The token is sent in the `Authorization: Bearer <token>` header by an Angular HTTP interceptor.
To switch to the real backend later, change `API_URL` in `frontend/src/app/core/config/api.config.ts`.

### Frontend commands

| Command (in `frontend/`) | Description |
|---|---|
| `npm start` | Development server (`http://localhost:4200`) |
| `npm run build` | Production build (lazy-loaded pages, SSR + prerendering) |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint (TypeScript, Angular and template accessibility rules) |
| `npm run format` / `npm run format:check` | Format / check the code with Prettier |

### Frontend features (Objectif 4)

- All sitemap pages: home, domains map, domain and combination pages (tabs), atlas (radar + sliders), quiz,
  double degree list + school page, login / register / forgot password, profile, admin area, about, contact,
  privacy, 404.
- Reusable components (`shared/components`): navbar, footer, page header, tabs, cards, roadmap, empty state,
  loader, async state (loading skeleton / error + retry).
- Complete routing with lazy loading, route guards (logged-in user, admin) and page titles.
- Dynamic data from the mock API: display, creation, update and deletion (admin area, favorites, saved results,
  contact messages).
- UX: loading skeletons and spinners, error messages, light CSS transitions, responsive menu (mobile / tablet).
- Accessibility: skip link, focus management after navigation, ARIA labels and live regions, keyboard-usable
  map and tabs, `prefers-reduced-motion` support.

### Technical choices

- **Angular** (imposed for the projects that start development, and a good fit here): standalone components,
  signals for state, built-in router with lazy loading and guards, SSR + prerendering for fast first display
  and good SEO, TypeScript everywhere (shared with the Express backend).
- **Mock API (json-server)** instead of hard-coded data: the frontend already talks HTTP/REST exactly as it will
  with the real backend (same routes, `Authorization: Bearer` token, error codes 400/401/403/404/409).
  This let the frontend be finished and tested while the Express/PostgreSQL backend is still being built.
- **Switching to the real backend**: set `API_URL` in `frontend/src/app/core/config/api.config.ts` to
  `http://localhost:3000/api` and implement the same routes in Express (`/domaines`, `/ecoles`, `/auth/login`…).
  The pages do not change: they only use `DataService`, `AuthService` and `ProfileService`.
  A first real-backend page already exists: `/domaines-api` (CRUD on PostgreSQL domains, port 3000).
- **Quality**: ESLint (angular-eslint), Prettier, Vitest unit tests (services, matching algorithm, pages).

### Lighthouse (production build, with the mock API)

| Page | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/` | 96 | 100 | 100 | 100 |
| `/domaines/domaine/ia` | 96 | 100 | 100 | 100 |
| `/double-diplome` | 88 | 100 | 100 | 100 |
| `/atlas` | 88 | 100 | 100 | 100 |

### Backend (Express + PostgreSQL — in progress)

From the `backend` directory:

```bash
npm run dev
```

Backend address:

```text
http://localhost:3000
```

### Backend Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm run typecheck` | Check TypeScript types |
| `npm start` | Run compiled application |

---

## 🤝 Contributing

SUPCOMPASS is an evolving collaborative project. Future contributors are welcome.

You can contribute by:

- Improving the user interface.
- Developing new modules.
- Updating academic and professional information.
- Adding educational institutions and career opportunities.
- Improving database structures.
- Fixing bugs and improving performance.
- Adding documentation and tests.

### Contribution Workflow

1. Clone the repository.
2. Pull the latest changes from `main`.
3. Create a branch for your work.
4. Implement and test your modifications.
5. Commit your changes with a descriptive message.
6. Push your branch to GitHub.
7. Submit a Pull Request for review.

Example:

```bash
git pull origin main

git checkout -b feature/new-functionality

git add .

git commit -m "Add new functionality"

git push origin feature/new-functionality
```

Avoid pushing unfinished changes directly to the `main` branch.

---

## 👥 Project Information

**Project:** SUPCOMPASS  
**Domain:** Academic & Professional Orientation  
**Institution:** SUP'COM  
**Architecture:** Angular + Node.js + PostgreSQL  
**Repository:** [SUPCOMPASS/SUP-COMPASS](https://github.com/SUPCOMPASS/SUP-COMPASS)

---

*SUPCOMPASS — Explore your opportunities. Discover your potential. Build your future.*