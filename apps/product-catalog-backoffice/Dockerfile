# Stage de build
FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers sources
COPY . .

# Build de l'application
RUN npm run build

# Stage de production
FROM nginx:alpine

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés depuis le stage de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port 80
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"] 