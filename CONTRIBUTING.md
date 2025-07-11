# Guide de Contribution - JJ-P1114 STUDIO

## 🚀 Mise en place du projet

### Prérequis
- Node.js 18+
- PostgreSQL
- Git

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/YOUR-USERNAME/jj-p1114-studio.git
cd jj-p1114-studio

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec vos paramètres

# Initialiser la base de données
npm run db:push

# Démarrer en mode développement
npm run dev
```

## 📝 Structure du code

### Frontend (`/client`)
- React 18 avec TypeScript
- Tailwind CSS pour le styling
- Radix UI + shadcn/ui pour les composants
- React Query pour la gestion d'état serveur

### Backend (`/server`)
- Express.js avec TypeScript
- Drizzle ORM pour PostgreSQL
- Authentification Replit Auth
- Sessions PostgreSQL

### Partagé (`/shared`)
- Schémas de données Drizzle
- Types TypeScript communs
- Validation Zod

## 🔧 Développement

### Règles de code
- Utiliser TypeScript strict
- Suivre les conventions ESLint
- Nommer les fichiers en kebab-case
- Composants React en PascalCase

### Branches
- `main` : Production stable
- `develop` : Développement en cours
- `feature/nom-fonctionnalité` : Nouvelles fonctionnalités

### Commits
Format : `type(scope): description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatting/style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

Exemples :
```
feat(auth): add Replit authentication
fix(ui): resolve mobile navigation bug
docs(readme): update installation steps
```

## 🧪 Tests

### Tests unitaires
```bash
# Exécuter les tests
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Tests d'intégration
```bash
# Tester l'API
npm run test:api

# Tester l'interface
npm run test:ui
```

## 📋 Checklist avant soumission

### Code Quality
- [ ] Code formaté et lint clean
- [ ] Types TypeScript corrects
- [ ] Pas de console.log oubliés
- [ ] Variables d'environnement documentées

### Fonctionnalité
- [ ] Fonctionne en local
- [ ] Gère les cas d'erreur
- [ ] Interface responsive
- [ ] Accessible (ARIA)

### Documentation
- [ ] README mis à jour si nécessaire
- [ ] Commentaires pour logique complexe
- [ ] Variables d'environnement documentées

## 🔐 Sécurité

### Bonnes pratiques
- Ne jamais committer de secrets
- Utiliser les variables d'environnement
- Valider toutes les entrées utilisateur
- Échapper les données avant affichage

### Authentification
- Respecter les flow OAuth
- Gérer l'expiration des sessions
- Vérifier les autorisations

## 📊 Base de données

### Migrations
```bash
# Créer une nouvelle migration
npm run db:generate

# Appliquer les changements
npm run db:push

# Voir le statut
npm run db:status
```

### Schéma
- Modifier uniquement `shared/schema.ts`
- Utiliser Drizzle ORM
- Nommer les tables en anglais

## 🚀 Déploiement

### Environnements
- **Development** : Local avec base de données de test
- **Staging** : Branche develop avec données de test
- **Production** : Branche main avec données réelles

### Process
1. Créer une branche feature
2. Développer et tester
3. Créer une Pull Request
4. Review et validation
5. Merge vers develop
6. Tests d'intégration
7. Merge vers main
8. Déploiement automatique

## 📞 Support

### Issues
- Utiliser les templates GitHub
- Fournir les étapes de reproduction
- Inclure les logs d'erreur
- Spécifier l'environnement

### Questions
- Vérifier la documentation existante
- Chercher dans les issues fermées
- Utiliser les discussions GitHub

## 🎯 Roadmap

### Priorités actuelles
1. Amélioration de l'UX
2. Optimisation des performances
3. Tests automatisés
4. Documentation API

### Fonctionnalités futures
- Notifications en temps réel
- Système de facturation
- API publique
- Application mobile

---

**Merci de contribuer à JJ-P1114 STUDIO !** 🙏