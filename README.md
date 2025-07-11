# JJ-P1114 STUDIO INC - Plateforme de Gestion de Logiciels

Une plateforme complète de développement et gestion de logiciels sur mesure pour entreprises.

## 🚀 Fonctionnalités

- **Page d'accueil corporative** - Présentation professionnelle de l'entreprise
- **Système d'authentification** - Connexion sécurisée via Replit Auth
- **Catalogue de logiciels** - Parcourir et acheter des logiciels d'entreprise
- **Constructeur de prototypes** - Créer et tester des prototypes interactifs
- **Gestion des licences** - Système automatique de génération de licences
- **Tableau de bord client** - Suivi des commandes et licences
- **Système de contact** - Formulaire pour demandes personnalisées

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Base de données**: PostgreSQL avec Drizzle ORM
- **Authentification**: Replit Auth (OpenID Connect)
- **Interface utilisateur**: Radix UI + shadcn/ui

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/jj-p1114-studio.git
cd jj-p1114-studio

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos paramètres
```

## 🔧 Configuration

### Variables d'environnement requises

```env
# Base de données
DATABASE_URL=postgresql://...

# Authentification
SESSION_SECRET=your-session-secret
REPLIT_DOMAINS=your-domain.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
```

### Initialiser la base de données

```bash
# Pousser le schéma vers la base de données
npm run db:push
```

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 📁 Structure du projet

```
├── client/                 # Application React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   └── lib/            # Utilitaires
├── server/                 # API Express
│   ├── routes.ts           # Routes API
│   ├── storage.ts          # Logique de stockage
│   └── replitAuth.ts       # Configuration authentification
├── shared/                 # Code partagé
│   └── schema.ts           # Schéma de base de données
└── package.json
```

## 🎯 Utilisation

1. **Visiteurs non connectés** : Peuvent parcourir la page d'accueil et les services
2. **Clients connectés** : Accès complet aux fonctionnalités
   - Acheter des logiciels
   - Créer des prototypes
   - Gérer leurs licences
   - Soumettre des demandes

## 🚀 Déploiement

Ce projet est configuré pour le déploiement automatique via GitHub Actions.

### Déploiement manuel sur Replit

1. Connectez votre compte GitHub à Replit
2. Importez ce repository
3. Configurez les variables d'environnement
4. Démarrez l'application

### Déploiement sur d'autres plateformes

Le projet peut être déployé sur :
- Vercel
- Netlify
- Railway
- Render
- Heroku

## 🔒 Sécurité

- Authentification via OpenID Connect
- Sessions sécurisées avec PostgreSQL
- Cookies HTTP-only
- Validation des données avec Zod
- Protection CSRF intégrée

## 📄 Licence

© 2024 JJ-P1114 STUDIO INC. Tous droits réservés.

## 🤝 Contribution

Ce projet est propriétaire. Pour toute question ou contribution, contactez l'équipe de développement.

---

**JJ-P1114 STUDIO INC** - Solutions logicielles sur mesure pour entreprises