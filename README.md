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

---

## ▶️ Running the Application

The frontend and backend run separately during development.

**Backend:**

From the `backend` directory:

```bash
npm run dev
```

Backend address:

```text
http://localhost:3000
```

**Frontend:**

From the `frontend` directory:

```bash
npx ng serve
```

Open:

```text
http://localhost:4200
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