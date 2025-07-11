# 🚀 Déploiement Rapide Vercel

## Méthode 1 : Interface Vercel (Recommandée)

### 1. Préparation
- Assurez-vous que votre code est sur GitHub
- Créez un compte sur https://vercel.com

### 2. Déploiement en 3 clics
1. **Connectez GitHub** : Allez sur vercel.com → "New Project"
2. **Importez le repository** : Sélectionnez `jj-p1114-studio`
3. **Configurez** :
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Cliquez "Deploy"

### 3. Variables d'environnement
Dans les paramètres Vercel, ajoutez :
```
DATABASE_URL=votre_url_postgresql
SESSION_SECRET=votre_secret_session
REPLIT_DOMAINS=votre-projet.vercel.app
ISSUER_URL=https://replit.com/oidc
REPL_ID=votre_repl_id
```

## Méthode 2 : Script automatique

```bash
# Exécuter le script de déploiement
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

## Méthode 3 : Ligne de commande

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## ✅ Checklist post-déploiement

- [ ] Site accessible sur vercel.app
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] Authentification Replit fonctionnelle
- [ ] Test complet de l'application

## 🆘 Problèmes courants

**Erreur "Function Timeout"**
- Augmentez `maxDuration` dans `vercel.json`

**Erreur "Database Connection"**
- Vérifiez `DATABASE_URL`
- Utilisez une base PostgreSQL externe (Neon, Supabase)

**Erreur "Authentication"**
- Vérifiez `REPLIT_DOMAINS` avec votre domaine Vercel
- Confirmez `ISSUER_URL` et `REPL_ID`

---

**Votre application sera en ligne en moins de 5 minutes !** ⚡