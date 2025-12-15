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

### Sécurité Back-End

Locksy est construit avec le principe de *Security by Design*, intégrant des mécanismes défensifs dès la conception pour neutraliser les vecteurs d'attaque courants.

#### 1. Validation des Données

Toute donnée entrante est traitée comme potentiellement hostile par défaut. Locksy utilise les **ValidationPipes** de NestJS pour valider strictement les entrées via des **DTOs (Data Transfer Objects)**.

- **ValidationPipe Global** : Configuré dans `main.ts` pour appliquer automatiquement la validation à tous les contrôleurs.
- **DTOs avec Décorateurs** : Chaque DTO utilise `class-validator` pour imposer des contraintes strictes :
  - `@IsEmail()` pour les adresses email.
  - `@IsString()` et `@IsNotEmpty()` pour les chaînes non vides.
  - Exemple : `LoginDto` et `RegisterDto` rejettent les objets malformés (comme `{ "$ne": null }` pour les injections NoSQL).

Cela empêche les attaques par pollution de prototype et les injections, en garantissant que seules les données conformes au schéma passent.

#### 2. Stratégie Anti-Injection

Les requêtes sont immunisées contre les injections grâce à une séparation stricte entre code et données.

- **Requêtes SQL Paramétrées** : Toutes les requêtes brutes dans `auth.service.ts` utilisent des placeholders (`$1`, `$2`) et passent les données séparément via un tableau. Exemple :
  ```typescript
  const query = 'SELECT id_user FROM users WHERE email = $1';
  const users = await this.db.query(query, [email]);
  ```
  Cela empêche les injections SQL comme `1 OR 1=1`.

- **ORM TypeORM** : Pour les opérations standard, TypeORM gère automatiquement le paramétrage, éliminant les risques liés aux concaténations manuelles.

- **Protection NoSQL** : Bien que le projet utilise PostgreSQL, la validation stricte des DTOs empêche les injections similaires (ex: opérateurs `$ne` dans MongoDB).

#### 3. Gestion des Uploads (Non Applicable)

Le projet Locksy ne permet pas l'upload de fichiers actuellement. Si cette fonctionnalité est ajoutée à l'avenir, les mesures suivantes seront implémentées :
- Renommage systématique des fichiers avec UUID.
- Stockage isolé hors de la racine exécutable.
- Validation par "magic bytes" pour vérifier le type réel du fichier.

#### 4. Mesures Complémentaires

- **Helmet** : Active plus de 10 headers de sécurité HTTP (CSP, HSTS, etc.).
- **CSRF Protection** : Middleware personnalisé (`CsrfMiddleware`) qui bloque les requêtes cross-origin malveillantes pour les méthodes modifiant l'état (POST, PUT, DELETE) en vérifiant l'origine.
- **CORS Stricte** : Limite les origines autorisées pour prévenir les requêtes cross-origin malveillantes.
- **Zero-Knowledge** : Les données sensibles restent chiffrées côté client, le serveur ne les déchiffre jamais.
- **Rate Limiting** : Limite le nombre de tentatives de connexion (5 par 15 minutes) pour les endpoints d'authentification afin de prévenir les attaques par force brute.

---

### API Documentation

Le projet utilise **Swagger** pour générer une documentation interactive de l'API. Une fois le serveur démarré, accédez à `/api` pour explorer et tester les endpoints disponibles.

- **Titre** : Gestion MDP API
- **Version** : 1.0
- **Authentification** : Bearer Token (JWT)

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
npm install pg
```

3. Lancer le serveur de développement :
```bash
npm run start:dev
```

---

### Scripts disponibles

-   `npm run build` → compile le projet TypeScript en JavaScript
-   `npm run format` → reformate le code avec Prettier
-   `npm run start` → lance le serveur en mode production
-   `npm run start:dev` → lance le serveur en mode développement
-   `npm run start:debug` → lance le serveur en mode debug
-   `npm run start:prod` → lance le serveur en mode production (avec compilation)
-   `npm run lint` → analyse le code avec ESLint
-   `npm run test` → exécute les tests unitaires
-   `npm run test:watch` → exécute les tests en mode watch
-   `npm run test:cov` → exécute les tests avec couverture
-   `npm run test:debug` → exécute les tests en mode debug
-   `npm run test:e2e` → exécute les tests end-to-end
-   `npm audit` → vérifie les vulnérabilités de sécurité des dépendances

### CI/CD et Qualité du Code

Le projet utilise des pipelines CI/CD pour assurer la qualité et la sécurité du code :

- **Code Quality Check** : Utilise ESLint pour détecter les erreurs de code et les violations de style.
- **Security Audit** : Utilise `npm audit` pour identifier les vulnérabilités dans les dépendances.

#### Corrections Récentes

- **Fix ESLint Error** : Correction du type `any` dans `login.dto.ts` remplacé par `Record<string, unknown>` pour respecter les règles TypeScript strictes.
- **Suppression des Dépendances Vulnérables** : Suppression de `swagger` et `csurf` du `package.json` pour éliminer les vulnérabilités de sécurité (note : `@nestjs/swagger` et `@fastify/csrf-protection` sont encore présents mais utilisés de manière sécurisée).
- **Implémentation CSRF Personnalisée** : Ajout d'un middleware CSRF personnalisé (`CsrfMiddleware`) pour protéger contre les attaques cross-site request forgery en vérifiant l'origine des requêtes.
- **Configuration CORS** : Déplacement de l'origine CORS dans une variable d'environnement `CORS_ORIGIN` pour une meilleure configurabilité.
- **Correction du Stockage du Sel** : Changement de `Buffer.from(saltHex, 'hex')` à `Buffer.from(saltHex, 'base64')` dans la méthode d'enregistrement pour corriger le stockage du sel.
- **Correction du Décodage du Hash de Mot de Passe** : Changement de `Buffer.from(passwordHashHex, 'hex')` à `Buffer.from(passwordHashHex, 'base64')` dans les méthodes d'enregistrement et de connexion pour corriger le décodage du hash de mot de passe.
- **Suppression de JwtAuthGuard du Endpoint de Déconnexion** : Suppression de JwtAuthGuard du endpoint de déconnexion pour permettre la déconnexion sans token d'accès.

---

### Structure du projet

```
back-end/
├── .github/workflows       # pipelines CI/CD
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts       # contrôleur d'authentification
│   │   ├── auth.module.ts           # module d'authentification
│   │   ├── auth.service.ts          # service d'authentification
  │   │   ├── dto/
  │   │   │   ├── login.dto.ts         # DTO pour la connexion
  │   │   │   ├── refresh-token.dto.ts # DTO pour le rafraîchissement de token
  │   │   │   ├── register.dto.ts      # DTO pour l'enregistrement
  │   │   │   └── salt.dto.ts          # DTO pour le sel
│   │   └── jwt.guard.ts             # garde JWT
│   ├── database/
│   │   ├── entity/                  # définition des entités
│   │   │   ├── envelope.entity.ts   # entité enveloppe
│   │   │   ├── note.entity.ts       # entité note
│   │   │   ├── password.entity.ts   # entité mot de passe
│   │   │   ├── refresh-token.entity.ts # entité token de rafraîchissement
│   │   │   └── user.entity.ts       # entité utilisateur
│   │   ├── database.module.ts       # configuration et chargement de la base de données
│   │   ├── database.providers.ts    # injection de la connexion dans l'app
│   │   └── database.service.ts      # accès aux données et intéractions
  │   ├── notes/
  │   │   ├── dto/
  │   │   │   ├── create-note.dto.ts   # DTO pour créer une note
  │   │   │   └── update-note.dto.ts   # DTO pour mettre à jour une note
  │   │   ├── notes.controller.ts      # contrôleur des notes
  │   │   ├── notes.module.ts          # module des notes
  │   │   └── notes.service.ts         # service des notes
  │   ├── passwords/
  │   │   ├── dto/
  │   │   │   ├── create-password.dto.ts # DTO pour créer un mot de passe
  │   │   │   └── update-password.dto.ts # DTO pour mettre à jour un mot de passe
  │   │   ├── passwords.controller.ts  # contrôleur des mots de passe
  │   │   ├── passwords.module.ts      # module des mots de passe
  │   │   └── passwords.service.ts     # service des mots de passe
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts   # DTO pour créer un utilisateur
│   │   ├── user.model.ts            # modèle utilisateur
│   │   ├── users.controller.ts      # contrôleur des utilisateurs
│   │   ├── users.module.ts          # module des utilisateurs
│   │   └── users.service.ts         # service des utilisateurs
│   ├── app.controller.spec.ts       # tests unitaires
│   ├── app.controller.ts            # controller principal
│   ├── app.module.ts                # import des modules
│   ├── app.service.ts               # fonctions globales
│   ├── csrf.middleware.ts           # middleware de protection CSRF
│   └── main.ts                      # point d'entrée de l'app
├── .eslintrc.json          # configuration Eslint
├── .gitignore              # fichiers ignorés par Git
├── .prettierrc             # règles Prettier (formatage)
├── docker-compose.yml      # configuration Docker Compose
├── Dockerfile              # construction de l'image Docker
├── eslint.config.mjs       # règles ESLint (qualité du code)
├── nest-cli.json           # configuration Nest CLI
├── package.json            # scripts et dépendances du projet
├── package-lock.json       # verrouillage des versions exactes des dépendances
├── tsconfig.build.json     # configuration TypeScript pour le build
└── tsconfig.json           # configuration TypeScript
```
---

### Configurez votre .env

Créez un fichier .env et configurez le comme l'exemple ci-dessous.
ATTENTION : Il faut que les éléments correspondent à votre base de données et configuration.

Exemple de .env :
```.env
# --- Configuration Serveur ---

# Port du serveur Nest.js
NEST_PORT=3000

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

# --- Configuration JWT ---

# Clé secrète pour signer les tokens JWT (changez cette valeur en production)
JWT_SECRET=change_this_secret_in_production

# Durée d'expiration des tokens JWT (en secondes, ex: 900 = 15 minutes)
JWT_EXPIRATION_TIME=900

# Durée d'expiration des tokens de rafraîchissement (en jours, ex: 30)
REFRESH_EXP_DAYS=30

# --- Configuration CORS ---

# Origine autorisée pour les requêtes CORS (exemple en local)
CORS_ORIGIN=http://localhost:5173
```

