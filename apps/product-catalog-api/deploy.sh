#!/bin/bash

# Création d'une archive temporaire
echo "📦 Création de l'archive de déploiement..."
tar -czf deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.DS_Store' \
    --exclude='deploy.tar.gz' \
    .

echo "✅ Archive créée avec succès !"
echo "🚀 Vous pouvez maintenant déployer deploy.tar.gz sur Render" 