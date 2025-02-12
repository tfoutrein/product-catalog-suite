# Product Catalog Backoffice

Interface d'administration moderne pour la gestion de catalogue de produits, développée avec Svelte et TailwindCSS.

## Fonctionnalités

- 🎨 Interface moderne avec 3 thèmes : Clair, Sombre et Coloré
- 🎯 Gestion complète des produits (CRUD)
- 📂 Gestion des catégories et sous-catégories
- 🤖 Génération automatique de descriptions de produits avec IA
- 🔍 Détection automatique des marques
- 🖼️ Recherche automatique d'images de produits
- 🎭 Effets visuels dynamiques avec profondeur et animations
- 📱 Interface responsive et adaptative

## Technologies

- Svelte
- TailwindCSS
- Vite
- TypeScript
- Lucide Icons
- Axios

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build
```

## Configuration Docker

L'application est conteneurisée avec Docker et peut être démarrée avec docker-compose :

```bash
# Construction et démarrage des conteneurs
docker-compose up --build

# Arrêt des conteneurs
docker-compose down
```

## Variables d'Environnement

Aucune variable d'environnement n'est requise pour le frontend, la configuration de l'API est gérée via le proxy nginx.

## Structure du Projet

```
src/
  ├── components/     # Composants réutilisables
  ├── routes/        # Pages de l'application
  ├── stores/        # Stores Svelte (thème, état)
  ├── App.svelte     # Composant racine
  └── main.ts        # Point d'entrée
```

## Thèmes et Styles

L'application propose trois thèmes :
- 🌞 **Light** : Thème clair par défaut
- 🌙 **Dark** : Thème sombre
- 🎨 **Colorful** : Thème avec dégradés et animations

La profondeur des éléments est personnalisable via un slider dans le menu des paramètres. 