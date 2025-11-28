# ---- Build stage ----
FROM node:20 AS build
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances,
COPY package.json ./
COPY nest-cli.json ./

# Installer toutes les dépendances (avec devDependencies pour pouvoir build),
RUN npm install

# Copier le reste du code
COPY . .

# Build NestJS (génère /dist)
RUN npm run build



# ---- Runtime stage ----
FROM node:20-alpine
WORKDIR /app

# Installer uniquement les dépendances de prod
COPY package*.json ./
RUN npm ci --only=production

# Copier les fichiers compilés (dist)
COPY --from=build /app/dist ./dist

# Exposer le port
EXPOSE 5000

# Lancer le serveur Nest (JS compilé)
CMD ["node", "dist/main.js"]
