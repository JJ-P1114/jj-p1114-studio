# Guide de Déploiement - JJ-P1114 STUDIO

## 📋 Étapes pour héberger sur GitHub

### 1. Créer un repository GitHub

1. Allez sur [GitHub.com](https://github.com) et connectez-vous
2. Cliquez sur "New repository"
3. Nommez le repository : `jj-p1114-studio`
4. Sélectionnez "Public" ou "Private" selon vos préférences
5. **Ne cochez pas** "Add a README file" (nous en avons déjà un)

### 2. Connecter votre projet local à GitHub

```bash
# Initialiser Git dans votre projet
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - JJ-P1114 STUDIO platform"

# Ajouter l'origine GitHub (remplacez YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/jj-p1114-studio.git

# Pousser vers GitHub
git push -u origin main
```

### 3. Configurer les variables d'environnement sur GitHub

1. Allez dans votre repository GitHub
2. Cliquez sur "Settings" → "Secrets and variables" → "Actions"
3. Ajoutez ces secrets :

```
DATABASE_URL=votre_url_postgresql
SESSION_SECRET=votre_secret_session
REPLIT_DOMAINS=votre_domaine.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=votre_repl_id
```

### 4. Déploiement automatique avec GitHub Actions

Le fichier `.github/workflows/deploy.yml` est déjà configuré pour :
- Compiler automatiquement le projet à chaque push
- Déployer sur GitHub Pages
- Gérer les builds de production

### 5. Activer GitHub Pages

1. Dans votre repository, allez dans "Settings" → "Pages"
2. Sélectionnez "Deploy from a branch"
3. Choisissez "gh-pages" comme source
4. Votre site sera disponible à : `https://your-username.github.io/jj-p1114-studio`

## 🚀 Alternatives d'hébergement

### Replit Deployments (Recommandé)
- Plus simple pour les applications full-stack
- Base de données PostgreSQL incluse
- Authentification Replit native
- Domaine personnalisé possible

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/public
```

### Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

## 🔧 Configuration Production

### Variables d'environnement requises

```env
# Base de données
DATABASE_URL=postgresql://...

# Session
SESSION_SECRET=your-super-secret-key

# Domaines autorisés
REPLIT_DOMAINS=your-domain.com,your-domain.replit.app

# Authentification
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id

# Environment
NODE_ENV=production
```

### Build de production

```bash
# Compiler le frontend et backend
npm run build

# Démarrer en production
npm start
```

## 📊 Monitoring et maintenance

### Logs
- Vérifiez les logs de déploiement dans l'onglet "Actions"
- Surveillez les erreurs dans la console du navigateur

### Mises à jour
```bash
# Mettre à jour les dépendances
npm update

# Rebuilder
npm run build

# Redéployer
git add .
git commit -m "Update dependencies"
git push
```

## 🔒 Sécurité

- Toujours utiliser HTTPS en production
- Configurer les CORS appropriés
- Vérifier les variables d'environnement sensibles
- Utiliser des secrets GitHub pour les clés API

## 📞 Support

Pour toute question de déploiement, consultez :
- Documentation GitHub Pages
- Documentation Replit Deployments
- Support technique JJ-P1114 STUDIO