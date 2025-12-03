# Locksy • Back-end Nest.js

### Présentation

La partie **backend** de l'application Locksy est développée en **Nest.js**.
Elle gère l’**API sécurisée** permettant la création et la gestion des utilisateurs, des mots de passe et des notes, ainsi que l’interaction avec la base de données.

Le projet suit les bonnes pratiques du développement backend, notamment l’usage d’**ESLint**, **Prettier**, d’une architecture **modulaire Nest.js**, et d’un environnement **Docker** pour la mise en production.

Sur le plan **sécurité**, Locksy suit une logique *zero-knowledge* cohérente avec la partie front-end :

* Les données sensibles arrivent **déjà chiffrées** côté client (AES-GCM).
* Le serveur ne manipule donc **jamais les données en clair**, mais stocke et restitue uniquement les données chiffrées.
* Les mots de passe d’authentification utilisateur sont **hachés côté serveur** (Argon2 ou bcrypt selon votre implémentation).
* La structure des entités et schémas est conçue pour assurer une **compatibilité future** et une séparation stricte des rôles (users, notes, passwords).

Le backend sert ainsi uniquement d’**intermédiaire fiable**, garantissant l’intégrité, la cohérence et la sécurité des données, sans jamais accéder aux informations privées des utilisateurs.

---

### Table des matières

-   [Prérequis](#prérequis)
-   [Dépendances principales](#dépendances-principales)
-   [Installation et configuration](#installation-et-configuration)
-   [Scripts disponibles](#scripts-disponibles)
-   [Structure du projet](#structure-du-projet)

---

### Prérequis

-   **Node.js** (version 18+ recommandée)
-   **npm** (fourni avec Node.js)
-   Ligne de commande (Terminal, PowerShell, Bash)
-   Navigateur moderne (Chrome, Edge, Firefox)

---

### Dépendances principales

-   **eslint** + **eslint-config-prettier** _(dev)_ : linting et cohérence du code
-   **prettier** _(dev)_ : formatage automatique

---

### Installation et configuration

1. Cloner le projet :
```bash
git clone https://github.com/locksy-securite/back-end.git
cd back-end
```

2. Installer les dépendances :
```bash
npm install
```

Installez les outils back-end requis :

Vous aurez besoin d'une base de données comme postgresSQL à installer dans ce lien : https://www.postgresql.org/download/

```bash
npm install -g @nestjs/cli
npm install typeorm
npm install jsonwebtoken
npm install bcrypt
npm install pg
```

3. Lancer le serveur de développement :
```bash
npm run start:dev
```

---

### Scripts disponibles

-   `npm run start:dev` → lance le serveur en mode développement
-   `npm run lint` → analyse le code avec ESLint
-   `npm run format` → reformate le code avec Prettier

---

### Structure du projet

```
back-end/
├── .github/workflows       # pipelines CI/CD
├── src/
│   ├── database/
│   │   ├── entity/                 # définition des entités
│   │   │   ├── note.entity.ts
│   │   │   ├── password.entity.ts
│   │   │   └── user.entity.ts
│   │   ├── database.module.ts      # configuration et chargement de la base de données
│   │   ├── database.providers.ts   # injection de la connexion dans l'app
│   │   └── database.service.ts     # accès aux données et intéractions
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── user.controllers.ts
│   │   ├── user.model.ts
│   │   ├── user.module.ts 
│   │   └── user.service.ts
│   ├── app.controller.spec.ts      # tests unitaires
│   ├── app.controller.ts           # controller principal
│   ├── app.module.ts               # import des modules
│   ├── app.service.ts              # fonctions globales
│   └── main.ts                     # point d'entrée de l'app
├── .eslintrc.json          # configuration Eslint
├── .gitignore              # fichiers ignorés par Git
├── .prettierrc             # règles Prettier (formatage)
├── Dockerfile              # construction de l'image Docker
├── eslint.config.mjs       # règles ESLint (qualité du code)
├── nest-cli.json          
├── package.json            # scripts et dépendances du projet
├── package-lock.json       # verrouillage des versions exactes des dépendances
├── tsconfig.build.json
└── tsconfig.json
```
---

### Back-end 

Configurez votre .env
ATTENTION : Il faut que les éléments correspondent à votre base de données. 

Exemple de .env :  
```.env
# --- Configuration PostgreSQL ---

# Nom d'hôte du serveur de base de données
PGHOST=localhost

# Port de connexion (le code utilise 5432 par défaut s'il est omis, mais il est préférable de le définir)
PGPORT=5432

# Nom d'utilisateur de la base de données
PGUSER=utilisateur_demo

# Mot de passe de la base de données
PGPASSWORD=MonSuperMotDePasse

# Nom de la base de données
PGDATABASE=ma_base_de_donnees_app
```

