# Product Catalog Suite

Une suite complète d'applications pour la gestion de catalogues de produits, comprenant une interface d'administration moderne et une API REST.

## 🌟 Applications

### Product Catalog Backoffice
Interface d'administration moderne construite avec Svelte et TailwindCSS, offrant :
- 🎨 Interface utilisateur moderne avec thèmes personnalisables
- 🛍️ Gestion complète des produits (CRUD)
- 🤖 Génération automatique de descriptions avec IA
- 🔍 Détection intelligente des marques
- 🖼️ Recherche automatique d'images
- ✨ Effets visuels dynamiques
- 📱 Design responsive

### Product Catalog API
API REST pour la gestion du catalogue, proposant :
- 📦 Gestion complète des produits et catégories
- 🤖 Génération de descriptions via Google Search et Hugging Face
- 🔍 Détection de marques via base de données
- 🖼️ Recherche d'images via Google Image Search
- 📝 Génération de descriptions par templates

## 🚀 Démarrage Rapide

1. Cloner le dépôt :
```bash
git clone [url-du-repo]
cd product-catalog-suite
```

2. Configurer les variables d'environnement :
```bash
# Créer un fichier .env à la racine
cp .env.example .env

# Configurer les clés API nécessaires
GOOGLE_API_KEY=votre_clé_api_google
GOOGLE_CSE_ID=votre_id_custom_search_engine
HUGGING_FACE_API_KEY=votre_clé_api_hugging_face
```

3. Démarrer avec Docker :
```bash
docker-compose up --build
```

4. Accéder aux applications :
- Backoffice : http://localhost
- API : http://localhost:3000
- Base de données : localhost:5432

## 🛠️ Technologies Utilisées

### Frontend (Backoffice)
- Svelte
- TailwindCSS
- Vite
- TypeScript
- Lucide Icons
- Axios

### Backend (API)
- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Google Custom Search API
- Hugging Face API

## 🎨 Thèmes

Le backoffice propose trois thèmes :
- ☀️ Light : Interface claire et professionnelle
- 🌙 Dark : Mode sombre élégant
- 🌈 Colorful : Interface dynamique avec gradients animés

## 📁 Structure du Projet

```
product-catalog-suite/
├── apps/
│   ├── product-catalog-backoffice/   # Interface d'administration
│   └── product-catalog-api/          # API REST
├── docker-compose.yml                # Configuration Docker
└── README.md                         # Documentation principale
```

## 🔧 Configuration Docker

Le projet utilise Docker Compose pour orchestrer les services :
- Frontend (Nginx)
- API (Node.js)
- Base de données (PostgreSQL)

## 📝 Documentation

Consultez les README spécifiques dans chaque dossier d'application pour plus de détails :
- [Documentation Backoffice](apps/product-catalog-backoffice/README.md)
- [Documentation API](apps/product-catalog-api/README.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request. 