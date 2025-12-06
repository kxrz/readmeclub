# Xteink Community Hub

Plateforme communautaire pour partager et découvrir des ressources pour Xteink.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- npm ou yarn
- Compte Supabase

### Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd xteinkhub2026
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

4. Configurer Supabase

- Créer un projet sur [Supabase](https://supabase.com)
- Créer les buckets Storage : `resources` et `wallpapers` (public)
- Exécuter les migrations SQL dans l'ordre :
  - `supabase/migrations/001_initial_schema.sql`
  - `supabase/migrations/002_rls_policies.sql`

5. Lancer le serveur de développement
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:4321`

## 📁 Structure du projet

```
├── src/
│   ├── components/       # Composants Astro réutilisables
│   ├── pages/           # Routes Astro (pages + API)
│   ├── layouts/         # Layouts Astro
│   ├── lib/             # Utilitaires et clients
│   │   ├── supabase/    # Clients Supabase
│   │   └── utils/       # Utilitaires (rate limiting, etc.)
│   ├── i18n/            # Système d'internationalisation
│   └── styles/          # Styles globaux
├── supabase/
│   └── migrations/      # Migrations SQL
└── public/              # Assets statiques
```

## 🌐 Internationalisation

Le site supporte 5 langues :
- EN (anglais) - langue par défaut
- FR (français)
- ES (espagnol)
- RU (russe)
- CN (chinois)

Les traductions sont dans `src/i18n/languages.ts`.

## 🗄️ Base de données

### Tables principales

- `resources` : Catalogue de ressources communautaires
- `wallpapers` : Galerie de wallpapers
- `feature_requests` : Demandes de fonctionnalités avec votes
- `location_declarations` : Déclarations de localisation
- `analytics` : Statistiques globales

### Storage Supabase

- Bucket `resources` : Fichiers uploadés (ressources)
- Bucket `wallpapers` : Images wallpapers

## 🔐 Administration

L'administration se fait via un système simple de cookie :
- Page de login : `/admin`
- Mot de passe défini dans `ADMIN_PASSWORD`
- Cookie `admin_session` valide 24h

## 📤 API Routes

### Ressources

- `GET /api/resources` : Liste des ressources
- `POST /api/resources` : Créer une ressource
- `GET /api/resources/[id]` : Détails d'une ressource
- `GET /api/resources/[id]/download` : Télécharger une ressource
- `POST /api/resources/upload` : Upload de fichier

### Rate Limiting

- Maximum 5 soumissions par IP toutes les 24h
- Tracking via hash SHA-256 de l'IP

## 🚀 Déploiement sur Vercel

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Déployer automatiquement via Git

Le projet utilise l'adapter `@astrojs/vercel/serverless` pour le SSR.

## 📝 Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build local

## 🛠️ Technologies utilisées

- **Astro 5** : Framework SSR
- **Tailwind CSS 4** : Styling
- **Supabase** : Base de données + Storage
- **TypeScript** : Typage statique
- **Zod** : Validation de schémas

## 📚 Documentation

Voir `PROJECT_MIGRATION_GUIDE.md` pour plus de détails sur l'architecture.
