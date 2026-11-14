# 🎓 SUPCOMPASS
### Your Academic & Professional Orientation Platform

<p align="center">
  <strong>Explore. Discover. Choose. Build Your Future.</strong>
</p>

<p align="center">
  A modern web platform designed to help students explore academic opportunities, discover professional careers, and build their future with confidence.
</p>

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Project Objectives](#-project-objectives)
4. [Main Features](#-main-features)
5. [Understanding the Platform](#-understanding-the-platform)
6. [User Roles](#-user-roles)
7. [Technology Stack](#-technology-stack)
8. [System Architecture](#-system-architecture)
9. [Project Structure](#-project-structure)
10. [Database Architecture](#-database-architecture)
11. [Installation and Setup](#-installation-and-setup)
12. [Running the Application](#-running-the-application)
13. [API Documentation](#-api-documentation)
14. [Development Workflow](#-development-workflow)
15. [Security](#-security)
16. [Future Improvements](#-future-improvements)
17. [Contributing](#-contributing)
18. [Project Team](#-project-team)
19. [License](#-license)

---

# 🌍 Project Overview

**SUPCOMPASS** is a web-based academic and professional orientation platform designed to guide students throughout their educational and career journeys.

Choosing an academic specialization, identifying suitable universities, understanding professional opportunities, and planning a future career can be complicated.

SUPCOMPASS aims to centralize these different aspects within a single digital environment.

The platform provides students with an organized way to:

- Explore academic fields and specializations.
- Discover different professions and career opportunities.
- Identify educational institutions and available study programs.
- Understand the relationship between academic specializations and professional careers.
- Explore possible academic and professional pathways.
- Save interesting opportunities and build a personalized orientation experience.

The platform also includes an administrative environment intended to manage the information available to users.

**SUPCOMPASS is more than an information website: it is designed to become a decision-support tool for academic and professional orientation.**

---

# 🎯 Problem Statement

Students frequently face several difficulties when making academic and professional decisions.

Among the main challenges:

- Lack of centralized and structured information.
- Difficulty comparing academic specializations.
- Limited understanding of the relationship between studies and professional careers.
- Difficulty identifying suitable educational institutions.
- Lack of personalized guidance when planning an academic pathway.
- Difficulty organizing and keeping track of interesting opportunities.

SUPCOMPASS addresses these challenges by bringing together academic information, professional opportunities, educational institutions, and orientation resources in one platform.

---

# 🚀 Project Objectives

The main objectives of SUPCOMPASS are:

### 1. Centralize information

Provide a structured environment where students can access academic and professional information without having to consult multiple unrelated sources.

### 2. Facilitate academic exploration

Allow students to discover academic domains, specializations, and educational opportunities.

### 3. Improve career awareness

Help users understand different professions, their characteristics, and their relationships with academic studies.

### 4. Support decision-making

Make it easier to identify possible combinations between academic backgrounds and professional objectives.

### 5. Build academic pathways

Provide a structured representation of possible educational and professional journeys.

### 6. Offer an organized user experience

Provide a modern, responsive, and intuitive interface.

---

# ✨ Main Features

The platform is organized into several functional modules.

## 1. 🏠 Home Page

The home page serves as the main entry point to SUPCOMPASS.

It introduces the platform and allows visitors to discover its main services.

Its intended elements include:

- Platform presentation.
- Main navigation menu.
- Introduction to academic and professional orientation.
- Access to the different exploration modules.
- Main calls to action.
- Information about the platform.

## 2. 🔐 Authentication

The authentication module manages user access.

It is designed to provide:

- User registration.
- User login.
- Password protection.
- Session authentication.
- User identity management.
- Role-based access.

The system distinguishes between student and administrator accounts.

## 3. 👤 User Management

This module manages user-related information.

Its responsibilities include:

- Managing user accounts.
- Retrieving user information.
- Managing account roles.
- Supporting authenticated user operations.

## 4. 🎓 Academic Domains

The academic domains module allows students to explore different fields of study.

It is intended to organize academic information and help users understand the available specializations.

## 5. 💼 Professional Careers

This module focuses on professional opportunities.

Students can discover different professions and understand their relationships with academic backgrounds.

Its intended information includes:

- Professional fields.
- Career descriptions.
- Required skills.
- Relevant academic specializations.
- Possible career opportunities.

## 6. 🏫 Educational Institutions

This module centralizes information about educational institutions.

Its purpose is to help students discover and compare potential institutions according to their academic interests.

## 7. 🔗 Academic and Professional Combinations

The combinations module represents possible relationships between:

- Academic domains.
- Specializations.
- Professional careers.
- Educational opportunities.

It helps students understand the different directions they can pursue.

## 8. 🧭 Orientation

The orientation module is designed to support students in identifying relevant academic and professional directions.

It represents one of the central components of the platform.

## 9. 🛤️ Academic and Professional Pathways

The pathways module focuses on the possible stages of an academic and professional journey.

It aims to help students visualize how their educational choices can lead to different career opportunities.

## 10. ⭐ Favorites

The favorites module allows users to organize interesting information.

It is designed to provide quick access to saved:

- Academic domains.
- Professional careers.
- Educational institutions.
- Other relevant opportunities.

## 11. ⚙️ Administration

The administration module provides a dedicated environment for managing platform information.

Its planned responsibilities include:

- Managing users.
- Managing academic domains.
- Managing professional careers.
- Managing educational institutions.
- Managing combinations and pathways.
- Maintaining the platform's information.

---

# 🧑‍💻 Understanding the Platform

SUPCOMPASS is organized around two main user experiences.

## A. Student Experience

The student is the primary user of the platform.

A typical journey through SUPCOMPASS is designed as follows:

**Step 1 — Discover the platform**

The student accesses the home page and discovers the services offered by SUPCOMPASS.

**Step 2 — Explore academic domains**

The student consults available academic fields and specializations.

**Step 3 — Discover professional opportunities**

The student explores professions and identifies possible career directions.

**Step 4 — Explore educational institutions**

The student discovers institutions and academic opportunities that correspond to their interests.

**Step 5 — Analyze possible combinations**

The student explores relationships between academic choices and professional objectives.

**Step 6 — Build an orientation pathway**

The student examines possible academic and professional pathways.

**Step 7 — Save interesting opportunities**

The student can use the favorites functionality to organize relevant information.

The objective is to provide a coherent experience that helps students move from exploration to informed decision-making.

## B. Administrator Experience

The administrator has a management-oriented experience.

The administrative environment is designed to support the organization and maintenance of the platform's information.

Administrators are intended to manage the main data categories and maintain the quality of the information presented to students.

---

# 👥 User Roles

SUPCOMPASS defines two principal user roles.

| Role | Description |
|---|---|
| Student | Explores academic domains, professional careers, institutions, and orientation pathways. |
| Administrator | Manages platform information and administrative operations. |

The database user model includes a role attribute distinguishing between `student` and `admin`.

---

# 🛠️ Technology Stack

SUPCOMPASS is developed using modern web technologies.

## Frontend

| Technology | Purpose |
|---|---|
| Angular | Frontend application framework |
| TypeScript | Application programming language |
| HTML5 | Web page structure |
| CSS3 | Styling and visual presentation |
| Chart.js | Data visualization where required |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Backend web framework |
| TypeScript | Backend development language |
| PostgreSQL | Relational database |
| pg | PostgreSQL connection and query management |
| dotenv | Environment variable management |
| JWT | Planned authentication mechanism |
| bcrypt | Planned password hashing mechanism |

## Development Tools

| Tool | Purpose |
|---|---|
| Visual Studio Code | Development environment |
| Git | Version control |
| GitHub | Source code collaboration |
| Postman | API testing |
| pgAdmin 4 | PostgreSQL database management |
| Figma | Interface design and prototyping |

---

# 🏗️ System Architecture

SUPCOMPASS follows a client-server architecture.

The application is divided into three principal layers.

### 1. Presentation Layer — Frontend

The Angular application is responsible for:

- Displaying the user interface.
- Managing navigation.
- Presenting information.
- Handling user interactions.
- Communicating with the backend API.

### 2. Application Layer — Backend

The Node.js and Express application handles:

- HTTP requests.
- Business logic.
- Authentication.
- User operations.
- Data processing.
- Database communication.
- API responses.

The backend follows a modular architecture based on routes, controllers, and services.

### 3. Data Layer — Database

PostgreSQL stores and manages the application's persistent information.

It is responsible for maintaining:

- User accounts.
- Academic information.
- Professional information.
- Educational institutions.
- Relationships between platform entities.
- User-related data.

### Architecture Diagram

```text
                 SUPCOMPASS
                      |
          +-----------+-----------+
          |                       |
      FRONTEND                 BACKEND
      Angular              Node.js / Express
          |                       |
          |                  REST API
          |                       |
          +---------- HTTP -------+
                                  |
                           DATABASE LAYER
                              PostgreSQL
                                  |
                         Persistent Storage
```

---

# 📂 Project Structure

The project is organized into separate frontend, backend, database, and documentation components.

```text
SUPCOMPASS/
│
├── .vscode/
│   ├── extensions.json
│   └── launch.json
│
├── frontend/
│   └── Angular application
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   │
│   └── src/
│       ├── config/
│       │   └── database.ts
│       │
│       ├── middleware/
│       │   └── error.middleware.ts
│       │
│       ├── modules/
│       │   ├── admin/
│       │   │   ├── controllers/
│       │   │   ├── routes/
│       │   │   ├── services/
│       │   │   └── validators/
│       │   │
│       │   ├── auth/
│       │   │   ├── controllers/
│       │   │   ├── routes/
│       │   │   └── services/
│       │   │
│       │   ├── users/
│       │   │   ├── controllers/
│       │   │   ├── routes/
│       │   │   └── services/
│       │   │
│       │   ├── domaines/
│       │   ├── metiers/
│       │   ├── combinaisons/
│       │   ├── parcours/
│       │   ├── orientation/
│       │   ├── ecoles/
│       │   └── favoris/
│       │
│       ├── types/
│       │
│       ├── utils/
│       │
│       └── server.ts
│
├── database/
│   ├── migrations/
│   │   └── 001_create_users.sql
│   │
│   └── seeds/
│
├── documentation/
│
├── .gitignore
├── README.md
└── ...
```

**Note:** The structure represents the project's organization. Some modules and directories are architectural components that are still being developed.

---

# 🗄️ Database Architecture

SUPCOMPASS uses PostgreSQL as its relational database management system.

The main database is named:

```text
supcompass
```

## Users Table

The initial database migration creates the `users` table.

Its principal attributes include:

| Attribute | Description |
|---|---|
| id | Unique user identifier (UUID) |
| first_name | User's first name |
| last_name | User's last name |
| email | Unique email address |
| password_hash | Hashed password |
| role | User role (student/admin) |
| created_at | Account creation timestamp |
| updated_at | Last update timestamp |

The migration also includes:

- UUID generation through PostgreSQL extensions.
- Email uniqueness.
- An index on the role attribute.
- Automatic update timestamp management through a trigger.

## Database Migration

The initial migration is located at:

```text
database/migrations/001_create_users.sql
```

It is responsible for creating the initial user database structure.

Additional migrations can be introduced as the application evolves.

---

# ⚙️ Installation and Setup

Follow these instructions to prepare the development environment.

## Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- PostgreSQL
- pgAdmin 4 (recommended)
- Git
- Visual Studio Code

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd SUPCOMPASS
```

## 2. Configure the Database

Open PostgreSQL using pgAdmin 4.

Create a database named:

```sql
CREATE DATABASE supcompass;
```

Make sure PostgreSQL is running.

Then execute the migration file:

```text
database/migrations/001_create_users.sql
```

The migration creates the initial users table and its associated database objects.

## 3. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory.

Example configuration:

```env
PORT=3000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/supcompass

JWT_SECRET=YOUR_RANDOM_SECRET

JWT_EXPIRES_IN=1d
```

Replace the database credentials and secret with your own values.

**Important:** Never commit the `.env` file to GitHub.

## 4. Configure the Frontend

Open another terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

---

# ▶️ Running the Application

The frontend and backend must be started separately during development.

## Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend development server is configured to use:

```text
http://localhost:3000
```

To check the backend health endpoint, open:

```text
http://localhost:3000/health
```

The endpoint can be used to verify that the server is responding.

### Backend Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run typecheck` | Checks TypeScript types |
| `npm run build` | Compiles the TypeScript application |
| `npm start` | Starts the compiled application |

## Start the Frontend

From the `frontend` directory:

```bash
npx ng serve
```

Open your browser:

```text
http://localhost:4200
```

The Angular development server will serve the frontend application.

---

# 🔌 API Documentation

The backend exposes a REST API intended to connect the Angular frontend with the PostgreSQL database.

The API is organized into functional modules.

## API Base URL

```text
http://localhost:3000
```

## Main API Modules

| Module | Responsibility |
|---|---|
| `/api/auth` | Authentication |
| `/api/users` | User management |
| `/api/admin` | Administration |
| `/api/domaines` | Academic domains |
| `/api/metiers` | Professional careers |
| `/api/combinaisons` | Academic and professional combinations |
| `/api/parcours` | Academic and professional pathways |
| `/api/orientation` | Orientation services |
| `/api/ecoles` | Educational institutions |
| `/api/favoris` | Favorites management |

These paths represent the intended API organization. They should not be considered active endpoints until their corresponding routes are implemented and registered.

## Authentication Endpoints

The following endpoints are planned:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user |

Authentication will use JWT-based authorization and password hashing.

---

# 🔄 Development Workflow

SUPCOMPASS uses Git and GitHub to coordinate development between team members.

The main development branch is:

```text
main
```

## Get the Latest Changes

```bash
git pull origin main
```

## Check Local Changes

```bash
git status
```

## Add Changes

```bash
git add .
```

## Create a Commit

```bash
git commit -m "Describe your changes"
```

## Push Changes to GitHub

```bash
git push origin main
```

### Recommended Practices

- Pull the latest changes before starting development.
- Avoid modifying the same files simultaneously without coordination.
- Use descriptive commit messages.
- Test your changes before pushing.
- Never commit credentials or environment files.
- Keep the project structure organized.

---

# 🔐 Security

Security is an important consideration in SUPCOMPASS.

The backend architecture includes or plans the following security mechanisms:

### Password Protection

Passwords must be stored using a secure hashing algorithm such as bcrypt.

Plain-text passwords must never be stored in the database.

### Authentication

JSON Web Tokens (JWT) are planned to authenticate users and support protected API operations.

### Role-Based Access Control

The platform distinguishes between student and administrator roles.

Administrative operations must be restricted to authorized users.

### Environment Variables

Sensitive configuration values must be stored in environment variables.

Examples include:

- Database credentials.
- JWT secrets.
- Server configuration.

The `.env` file must remain excluded from version control.

---

# 🔮 Future Improvements

SUPCOMPASS is designed to evolve progressively.

Potential improvements include:

- Completing the authentication system.
- Implementing role-based authorization.
- Completing the administration dashboard.
- Developing all academic and professional modules.
- Integrating the Angular frontend with the backend API.
- Improving the orientation experience.
- Developing personalized academic recommendations.
- Adding advanced search and filtering.
- Improving data visualization.
- Expanding the database structure.
- Adding automated tests.
- Improving accessibility and responsive design.

---

# 🤝 Contributing

Contributions are welcome from team members participating in SUPCOMPASS development.

To contribute:

1. Clone the repository.
2. Create or update your local development environment.
3. Pull the latest changes.
4. Implement your assigned functionality.
5. Test your changes.
6. Commit your work with a descriptive message.
7. Push your changes to GitHub.

For significant changes, coordinate with the development team before modifying shared components.

---

# 👨‍💻 Project Team

**Project:** SUPCOMPASS

**Domain:** Academic and Professional Orientation

**Development:** Collaborative Web Application Development

**Frontend:** Angular / TypeScript

**Backend:** Node.js / Express / TypeScript

**Database:** PostgreSQL

---

# 📄 License

The licensing terms of this project have not yet been specified.

---

<p align="center">
  <strong>SUPCOMPASS — Your Future Starts With the Right Direction.</strong>
</p>

<p align="center">
  Explore your opportunities. Discover your potential. Build your future.
</p>s