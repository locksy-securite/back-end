# Whitepaper  

## Concept Métier 

Locksy est un gestionnaire de mots de passe moderne et ultra‑sécurisé. Il permet aux utilisateurs de stocker et gérer leurs identifiants, notes et cartes bancaires dans un coffre chiffré, accessible uniquement par eux. Le serveur n’a jamais connaissance des clés de chiffrement, garantissant une confidentialité totale. 
 

## Donnée Critique 

La donnée critique que nous protégeons est l’ensemble des mots de passe des comptes utilisateurs. À cela s’ajoutent des informations sensibles comme les cartes bancaires, les notes sécurisées ou encore les documents. Ces données sont considérées comme hautement confidentielles et doivent rester inaccessibles à toute personne autre que l’utilisateur. 

Failles possibles : Pour la protection contre le bruteforce il faut être vigilant sur le calibrage d’Argon d’autant qu’un attaquant pourrait lancer un bruteforce hors ligne. 


## Schéma de Chiffrement 

### Inscription : 

- L’utilisateur saisit son mot de passe maître. 
- Un salt aléatoire unique est généré côté client. 
- Le mot de passe + salt passent dans Argon2id (fonction de dérivation de clé mémoire dur). 
- Cela produit une clé locale. 
- Le serveur stocke uniquement : email, salt, et le hash Argon2id du mot de passe. 
- La clé locale n’est jamais transmise au serveur. 


### Connexion : 

- Le serveur renvoie le salt associé à l’utilisateur. 
- Le client régénère la clé locale avec Argon2id (mot de passe + salt). 
- Cette clé locale sert à déchiffrer les données chiffrées reçues du serveur. 
- Le serveur ne fait que vérifier le hash pour authentifier l’utilisateur, sans jamais voir la clé ni les données en clair. 


### Chiffrement des données sensibles : 

- La clé locale dérivée est utilisée pour générer une clé maître. 
- Cette clé maître chiffre toutes les données sensibles avec AESGCM côté client. 
- Le serveur ne stocke que des blobs chiffrés (BYTEA), jamais les données en clair. 


## Preuve Zero‑Knowledge 

- La clé locale est toujours calculée côté client et n’est jamais envoyée au serveur. 
- Le serveur ne stocke que des hashs et des blobs chiffrés. 
- Même en cas de compromission du serveur, les données restent inexploitables sans le mot de passe maître de l’utilisateur. 


## Le Schéma de Chiffrement 

![Schéma de chiffrement](schema_chiffrement.drawio.png)


## Sécurité Front-End

TODO #front-end: 
> Justifiez vos choix de paramètres pour Argon2, présentez la structure de données versionnée que vous allez stocker, et décrivez votre plan de défense complet contre les attaques XSS.

Nous utilisons `dompurify` pour protéger notre code html contre les attaque XSS. Cela permet de s'assurer que le html que nous devons insérer dans notre code n'est pas corrompu.


## Sécurité Back-End

1. La Validation des Données : 
TODO #back-end :
  > Expliquez comment vous utilisez les DTOs et les `ValidationPipes` dans NestJS pour filtrer strictement les entrées.
2. La Stratégie Anti-Injection : 
  TODO #back-end :
  > Démontrez que vos requêtes (SQL ou NoSQL) sont immunisées contre les injections (utilisation de l'ORM, requêtes paramétrées…) et expliquez pourquoi.

=> TODO #back-end : 
  > Votre Whitepaper doit prouver que votre application est construite avec le principe de Security by Design, et non sécurisée après coup.


1. La Validation des Données :
Nous utilisons des DTOs (Data Transfer Objects) pour définir strictement la structure des données entrantes dans nos contrôleurs NestJS. Le ValidationPipe global appliqué dans main.ts valide automatiquement ces DTOs en utilisant des décorateurs comme @IsEmail, @IsString, etc., rejetant toute entrée non conforme avant qu'elle n'atteigne la logique métier.

2. La Stratégie Anti-Injection :
Toutes nos requêtes SQL utilisent TypeORM, un ORM qui paramètre automatiquement les requêtes, séparant les données des commandes SQL via des placeholders. Cela rend les injections SQL impossibles car les entrées utilisateur ne sont jamais concaténées directement dans les requêtes.

Notre application est construite avec le principe Security by Design : la sécurité est intégrée dès la conception, avec validation des entrées, ORM pour les requêtes, et chiffrement end-to-end, plutôt que d'ajouter des mesures après coup.



## Authentificiation & sécurité des accès

1. TODO #back-end & TODO #front-end :
  > Politique de Mots de Passe : Documentez l'algorithme choisi (bcrypt/argon2) et le coût paramétré (ex: salt rounds). Expliquez pourquoi ce coût est un bon équilibre pour votre infra.
2. Architecture d'Authentification :
    * TODO #back-end : 
    > Incluez un schéma explicatif de votre flux (Login -> Création JWT -> Stockage Cookie/LocalStorage -> Vérification Guard).
    * TODO #front-end : 
    > Justifiez le choix du mode de stockage (ex: "Nous utilisons des cookies HttpOnly pour prévenir le vol de token via XSS, contrairement au LocalStorage qui est accessible par tout script JS").
3. Pour le moment dans notre MVP, nous n'avons qu'un seul type d'utilisateur : l'utilisateur standard qui s'inscrit et se connecte. Techniquement il existe aussi le simple visiteur qui ne peut accéder qu'à la page d'accueil / d'inscription, et qui devient utilisateur aussitôt qu'il est inscrit.  


1. Politique de Mots de Passe :
Nous utilisons bcrypt pour le hachage des mots de passe côté client et serveur, avec un coût de 12 rounds. Ce coût offre un équilibre entre sécurité résistante au bruteforce hors ligne et performance acceptable pour notre infrastructure, sans ralentir l'expérience utilisateur.

2. Architecture d'Authentification :
    * Flux back-end : Login -> Vérification hash mot de passe -> Création JWT (access + refresh) -> Stockage en cookies HttpOnly -> Guards vérifient JWT sur routes protégées.
    * Nous utilisons des cookies HttpOnly pour stocker les tokens JWT, prévenant le vol via XSS contrairement au LocalStorage accessible par tout script JS.
3. Pour le moment dans notre MVP, nous n'avons qu'un seul type d'utilisateur : l'utilisateur standard qui s'inscrit et se connecte. Techniquement il existe aussi le simple visiteur qui ne peut accéder qu'à la page d'accueil / d'inscription, et qui devient utilisateur aussitôt qu'il est inscrit.

## Sécurité de l'infrastructure

/!\ Livrable technique :  
- Installation et activation de `helmet` dans `main.ts`.
- Configuration explicite de `enableCors` (pas de `origin: *`).
- Utilisation de `@nestjs/config` pour lire les variables d'environnement.

1. TODO #back-end : 
  > Configuration CORS : Montrez votre configuration NestJS et expliquez pourquoi vous avez restreint les origines (quels domaines sont autorisés et pourquoi).

2. TODO #back-end & TODO #front-end :
  > En-têtes HTTP : Listez les headers activés par Helmet dans votre projet et choisissez-en deux (ex: HSTS et X-Frame-Options) pour expliquer concrètement contre quelle attaque ils vous protègent.

1. Configuration CORS :
Notre configuration NestJS restreint les origines à 'https://startup.com', 'https://admin.com' uniquement, rejetant toute autre origine. Cela empêche les attaques CSRF et limite l'accès aux domaines de confiance, évitant les requêtes non autorisées depuis des sites malveillants.

2. En-têtes HTTP :
Helmet active des headers comme Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, etc. HSTS force les connexions HTTPS, protégeant contre les attaques man-in-the-middle ; X-Frame-Options empêche le clickjacking en interdisant l'intégration dans des frames.

3. Gestion des secrets :
![fichier .env](backend_gitignore.png)
Exemple dans main.ts : `const port = configService.get<number>('NEST_PORT') || 3000;` et dans auth.service.ts : `secret: this.configService.get<string>('JWT_SECRET')`. Cela injecte les variables sensibles depuis .env sans les hardcoder.


TODO #front-end & TODO #back-end & TODO #dev-ops (on peut s'en occuper côté devOps mais il faut juste nous indiquer où c'est dans le code pour qu'on comprenne et qu'on explique): 
> Exemple de code montrant l'utilisation du `ConfigService` pour injecter une variable sensible.


## Audit de sécurité et industrialisation

### Rapport d'audit automatisé

```
npm audit report
```

Résultat de l'audit : Le projet ne contient aucune vulnérabilité critique non justifiée, car la vulnérabilité trouvée est dans une dépendance indirecte et est résolue par via `npm audit fix`.

TODO #dev-ops : 
> [insérer la capture d'écran du résultat]
> Le projet final ne doit contenir aucune vulnérabilité critique non justifiée dans npm audit. 


### Automatisation CI/CD 
Nous bloquons les merge request tant que le code ne compile pas et n'est pas propre, et tant qu'il ne passe pas l'audit de sécurité.

```
name: Code Quality Check
on:
  pull_request:
    branches:
      - main
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm install
      - name: Lint (ESLint)
        run: npm run lint
      - name: Build the project
        run: npm run build
```
Ce script se déclenche lorsqu'une merge request est ouverte pour la branche main, il vérifie que le code compile sans erreur, et que le linter Eslint ne renvoie pas d'erreur.

```
name: Security Audit
on:
  pull_request:
    branches:
      - main
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run npm audit
        run: npm audit --audit-level=high
```
Ce script se déclenche également lors d'une pull request et vérifie qu'il n'y ait pas de failles de sécurité grâce à la commande `npm audit`.


### Autocritique - OWASP

TODO #dev-ops & TODO #back-end :
> Pour chaque point, expliquez en une phrase comment votre architecture NestJS le respecte (ex: "Injection SQL : Nous utilisons TypeORM qui sépare strictement les données de la requête via des placeholders, rendant l'injection impossible").

1. Injection : Les requêtes SQL ne sont pas concaténées, nous utilisons TypeORM partout.
2. Authentification : Les mots de passes sont hachés avec bycrypt dans le front et le back, et nous limitons à 3 tentatives échouées.
3. Composants vulnérabes : 
  TODO #dev-ops (need TODO #back-end) 
  > npm audit est vert. (cf partie sur le rapport d'audit)


### Stratégie de logs 

TODO #dev-ops (need TODO #back-end)
> Montrez un exemple concret de log généré par votre application (lors d'un login ou d'une erreur).
  Prouvez que ce log est "propre" (anonymisé, pas de mot de passe en clair).


  Exemple de log lors de la connexion à la base de données : "Connexion PostgreSQL OK: { now: '2023-10-01T12:00:00.000Z' }". Les logs sont propres, anonymisés, sans mots de passe en clair, utilisant uniquement des informations non sensibles comme timestamps et statuts de connexion.

