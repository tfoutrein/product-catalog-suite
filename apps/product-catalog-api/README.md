# Product Catalog API

API REST pour la gestion de catalogue de produits avec génération automatique de descriptions et détection de marques.

## Fonctionnalités

- 🛍️ Gestion complète des produits
- 📂 Gestion des catégories et sous-catégories
- 🤖 Génération automatique de descriptions avec Google Search et Hugging Face
- 🔍 Détection intelligente des marques via base de données de marques connues
- 🖼️ Recherche automatique d'images de produits via Google Image Search
- 📝 Génération de descriptions par templates si aucune information n'est trouvée

## Technologies

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Google Custom Search API
- Hugging Face API (mT5 pour la génération de résumés)

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm start
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

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Port de l'application
PORT=3000

# Configuration de la base de données
DB_HOST=postgres
DB_PORT=5432
DB_NAME=product_catalog
DB_USER=postgres
DB_PASSWORD=postgres

# Configuration Google Search API
GOOGLE_API_KEY=votre_clé_api_google
GOOGLE_CSE_ID=votre_id_custom_search_engine

# Configuration Hugging Face API
HUGGING_FACE_API_KEY=votre_clé_api_hugging_face

# Mode Debug
DEBUG_MODE=false
```

## API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Récupère un produit
- `POST /api/products` - Crée un nouveau produit
- `PUT /api/products/:id` - Met à jour un produit
- `DELETE /api/products/:id` - Supprime un produit

### Catégories
- `GET /api/categories` - Liste toutes les catégories
- `GET /api/categories/:id` - Récupère une catégorie
- `POST /api/categories` - Crée une nouvelle catégorie
- `PUT /api/categories/:id` - Met à jour une catégorie
- `DELETE /api/categories/:id` - Supprime une catégorie

### Descriptions
- `POST /api/descriptions/generate` - Génère une description pour un produit

### Marques
- `POST /api/brands/detect` - Détecte la marque d'un produit

## Base de Données des Marques

L'API inclut une base de données de marques connues organisée par catégories :
- Tech (Samsung, Apple, Sony, etc.)
- Mode (Nike, Adidas, Zara, etc.)
- Beauté (L'Oréal, Maybelline, etc.)
- Alimentation
- Maison
- Automobile
- Gaming 