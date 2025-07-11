# 🚀 Déploiement Vercel - JJ-P1114 STUDIO

## Prérequis

- Compte GitHub avec votre code
- Compte Vercel (gratuit)
- Base de données PostgreSQL externe (Neon, Supabase, etc.)

## 📋 Étapes de déploiement

### 1. Préparer la base de données

**Option A : Neon Database (Recommandé)**
1. Allez sur https://neon.tech
2. Créez un compte et un nouveau projet
3. Copiez l'URL de connexion PostgreSQL

**Option B : Supabase**
1. Allez sur https://supabase.com
2. Créez un nouveau projet
3. Récupérez l'URL PostgreSQL dans Settings → Database

### 2. Configurer Vercel

1. **Connexion à Vercel**
   - Allez sur https://vercel.com
   - Connectez-vous avec GitHub
   - Cliquez "New Project"

2. **Importer le repository**
   - Sélectionnez votre repository `jj-p1114-studio`
   - Cliquez "Import"

3. **Configuration du build**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 3. Variables d'environnement

Dans les paramètres Vercel, ajoutez ces variables :

```env
# Base de données
DATABASE_URL=postgresql://username:password@hostname:port/database

# Session
SESSION_SECRET=your-super-secret-session-key-min-32-characters

# Authentification Replit
REPLIT_DOMAINS=your-project.vercel.app
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id-from-replit

# PostgreSQL individuelles (si nécessaire)
PGHOST=hostname
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database

# Environment
NODE_ENV=production
```

### 4. Déployer

1. **Premier déploiement**
   - Cliquez "Deploy"
   - Attendez la fin du build
   - Votre site sera disponible sur `https://your-project.vercel.app`

2. **Initialiser la base de données**
   - Dans le terminal Vercel ou localement :
   ```bash
   # Avec l'URL de production
   DATABASE_URL=your-production-url npm run db:push
   ```

### 5. Configurer l'authentification

1. **Mettre à jour REPLIT_DOMAINS**
   - Ajoutez votre domaine Vercel : `your-project.vercel.app`
   - Si vous avez un domaine personnalisé, ajoutez-le aussi

2. **Tester l'authentification**
   - Allez sur votre site Vercel
   - Testez la connexion via Replit Auth

## 🔧 Configuration avancée

### Domaine personnalisé

1. **Dans Vercel**
   - Settings → Domains
   - Ajoutez votre domaine
   - Suivez les instructions DNS

2. **Mettre à jour les variables**
   ```env
   REPLIT_DOMAINS=your-domain.com,your-project.vercel.app
   ```

### Optimisations

1. **Mise en cache**
   ```json
   // Dans vercel.json
   "headers": [
     {
       "source": "/api/(.*)",
       "headers": [
         {
           "key": "Cache-Control",
           "value": "s-maxage=60, stale-while-revalidate"
         }
       ]
     }
   ]
   ```

2. **Régions**
   ```json
   // Dans vercel.json
   "functions": {
     "api/index.ts": {
       "maxDuration": 30,
       "regions": ["fra1", "lhr1"]
     }
   }
   ```

## 🔍 Débogage

### Erreurs communes

1. **"Function Timeout"**
   - Augmentez `maxDuration` dans `vercel.json`
   - Optimisez les requêtes de base de données

2. **"Database Connection Error"**
   - Vérifiez `DATABASE_URL`
   - Assurez-vous que la base est accessible depuis l'extérieur

3. **"Authentication Error"**
   - Vérifiez `REPLIT_DOMAINS`
   - Assurez-vous que `ISSUER_URL` et `REPL_ID` sont corrects

### Logs

```bash
# Voir les logs en temps réel
vercel logs your-project.vercel.app

# Logs d'une fonction spécifique
vercel logs your-project.vercel.app --scope=api
```

## 📊 Monitoring

### Analytics Vercel
- Visitez votre dashboard Vercel
- Consultez les Analytics et les fonctions
- Surveillez les performances

### Alertes
- Configurez des alertes pour les erreurs
- Surveillez l'utilisation des fonctions
- Vérifiez les métriques de performance

## 🚀 Déploiement continu

1. **Automatique**
   - Chaque push sur `main` déclenche un déploiement
   - Branches de développement créent des previews

2. **Hooks de déploiement**
   ```json
   // Dans vercel.json
   "github": {
     "enabled": true,
     "autoAlias": true
   }
   ```

## 💡 Conseils

1. **Performance**
   - Utilisez des connexions de base de données poolées
   - Minimisez les requêtes dans les fonctions serverless
   - Activez la mise en cache pour les données statiques

2. **Sécurité**
   - Utilisez HTTPS uniquement
   - Configurez les CORS appropriés
   - Protégez les routes sensibles

3. **Maintenance**
   - Surveillez les logs régulièrement
   - Mettez à jour les dépendances
   - Testez les déploiements en preview

---

**Votre application JJ-P1114 STUDIO sera déployée sur Vercel avec succès !** 🎉

### Support
- Documentation Vercel : https://vercel.com/docs
- Support : https://vercel.com/support
- Communauté : https://github.com/vercel/vercel/discussions