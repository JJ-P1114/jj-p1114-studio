#!/bin/bash

# Script de déploiement automatique pour Vercel
# JJ-P1114 STUDIO - Déploiement Vercel

echo "🚀 Déploiement JJ-P1114 STUDIO sur Vercel"
echo "==========================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Exécutez ce script depuis le répertoire racine du projet."
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Erreur: Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ Erreur: npm n'est pas installé"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérifier que le build fonctionne
echo "🔨 Test du build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build. Veuillez corriger les erreurs avant de continuer."
    exit 1
fi

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📥 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Connexion à Vercel
echo "🔐 Connexion à Vercel..."
vercel login

# Configuration du projet
echo "⚙️  Configuration du projet Vercel..."
vercel --confirm

# Déploiement
echo "🚀 Déploiement en cours..."
vercel --prod

echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement sur Vercel"
echo "2. Testez votre application"
echo "3. Configurez votre domaine personnalisé (optionnel)"
echo ""
echo "🔗 Ressources utiles :"
echo "- Dashboard Vercel: https://vercel.com/dashboard"
echo "- Documentation: https://vercel.com/docs"
echo "- Support: https://vercel.com/support"
echo ""
echo "🎉 Votre application JJ-P1114 STUDIO est maintenant en ligne !"