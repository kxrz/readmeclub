# 📚 Guide de Migration Technique - Projet Directory Platform

> **Document technique complet** pour la migration/refonte d'une plateforme directory basée sur Astro + Supabase  
> **Objectif** : Aider une IA à comprendre l'architecture complète et créer une nouvelle version

---

## 🎯 Vue d'Ensemble

### Type de Projet
**Platform Directory communautaire** avec :
- Catalogue de ressources (ressources téléchargeables, liens externes)
- Galerie de médias (wallpapers/images)
- Système de soumission communautaire
- Tableau de bord admin pour modération
- Internationalisation multi-langues
- Analytics et tracking de téléchargements

### Architecture Générale
```
┌─────────────────┐
│   Frontend      │  Astro 5 (SSR) + Tailwind CSS 4
│   (Presentation)│  Composants Astro, Pages dynamiques
└────────┬────────┘
         │ HTTP/API
┌────────▼────────┐
│   Backend API   │  Astro API Routes (serverless functions)
│   (Business)    │  Validation, Rate limiting, Authentication
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │  Supabase (PostgreSQL + Row Level Security)
│   (Data Layer)  │  Tables, RLS Policies, Functions
└────────┬────────┘
         │
┌────────▼────────┐
│   Storage       │  Supabase Storage (fichiers utilisateurs)
│   (Files)       │  Buckets publics/privés
└─────────────────┘
```

---

## 🛠️ Stack Technologique

### Frontend Framework
- **Astro 5.x** avec SSR (`output: 'server'`)
  - SSR complet pour toutes les pages
  - API Routes (`src/pages/api/**/*.ts`)
  - Composants Astro (`.astro`)
  - TypeScript strict

### Styling
- **Tailwind CSS 4.x** (via `@tailwindcss/vite`)
- **Design System** : Composants Alfred Theme (fondations + patterns)
- **Responsive** : Mobile-first approach
- **Dark mode** : Support via classes conditionnelles

### Base de Données
- **Supabase** (PostgreSQL + API REST)
  - Tables principales : `resources`, `wallpapers`, `feature_requests`, `location_declarations`, `analytics`
  - Row Level Security (RLS) pour sécurité
  - Functions PostgreSQL pour opérations complexes
  - Storage pour fichiers utilisateurs

### Internationalisation (i18n)
- **5 langues** : EN (default), FR, ES, RU, CN
- **Routing** : `/fr/page`, `/es/page`, etc. (default EN sans préfixe)
- **Système custom** : `src/i18n/languages.ts` + `useTranslations()` hook
- **Client-side** : `window.__I18N__` + `window.t()` pour JS

### Déploiement
- **Netlify** avec adapter `@astrojs/netlify`
  - SSR Functions automatiques
  - Build: `npm run build`
  - Publish: `dist/`
  - Node 20

### Autres Outils
- **Leaflet.js** : Cartes interactives
- **Satori + Resvg** : Génération OG images dynamiques
- **Vercel Analytics** : Tracking analytics
- **MDX** : Support markdown étendu

---

## 📁 Structure du Projet

```
project-root/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── modals/          # Modales (ResourceDetail, WallpaperDetail, etc.)
│   │   ├── forms/           # Formulaires (SubmitResource, SubmitWallpaper, etc.)
│   │   ├── global/          # Header, Footer, Navigation
│   │   ├── fundations/      # Design system (Button, Text, Wrapper, etc.)
│   │   └── ...
│   ├── pages/               # Routes Astro
│   │   ├── [lang]/          # Pages traduites (FR, ES, RU, CN)
│   │   │   ├── index.astro
│   │   │   ├── resources.astro
│   │   │   ├── wallpapers.astro
│   │   │   └── ...
│   │   ├── api/             # API Routes (serverless)
│   │   │   ├── resources/
│   │   │   ├── wallpapers/
│   │   │   ├── feature-requests/
│   │   │   ├── admin/
│   │   │   └── analytics/
│   │   ├── admin/           # Pages admin (protégées)
│   │   └── og-image.png.ts  # Dynamic OG image generation
│   ├── layouts/
│   │   └── BaseLayout.astro # Layout principal avec Header/Footer
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts    # Client Supabase public (anon key)
│   │       ├── admin.ts     # Client Supabase admin (service role key)
│   │       └── schema.ts    # Types TypeScript pour tables
│   ├── i18n/
│   │   ├── languages.ts     # Dictionnaire de traductions (800+ clés)
│   │   └── utils.ts         # Helpers i18n (useTranslations, getLangFromUrl)
│   ├── styles/
│   │   └── global.css       # Styles globaux Tailwind
│   └── images/              # Assets statiques
├── public/                  # Assets publics (copiés tel quel)
│   ├── logo.svg
│   ├── favicon.png
│   └── ...
├── supabase/
│   └── migrations/          # Migrations SQL (versionnées)
│       ├── 001_initial_schema.sql
│       ├── 003_admin_moderation.sql
│       └── ...
├── scripts/                 # Scripts utilitaires (migrations, traductions, etc.)
├── astro.config.mjs         # Configuration Astro
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances npm
└── netlify.toml             # Configuration Netlify
```

---

## 🗄️ Architecture Base de Données

### Tables Principales

#### `resources`
Catalogue de ressources communautaires (fichiers, liens, outils)
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('language_file', 'plugin', 'link', 'documentation', 'tool', 'info', 'other')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  version VARCHAR(50),
  compatibility VARCHAR(255),
  installation_instructions TEXT,
  known_issues TEXT,
  file_url TEXT,                    -- URL Supabase Storage
  file_name VARCHAR(255),           -- Nom de fichier original
  external_link TEXT,               -- Lien externe (alternative à file_url)
  contributor_name VARCHAR(255),
  contact_info VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'flagged', 'removed')),
  hidden BOOLEAN DEFAULT false,     -- Modération: cacher du public
  downloads_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,                       -- Notes internes admin
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `wallpapers`
Galerie d'images/wallpapers communautaires
```sql
CREATE TABLE wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  title VARCHAR(60),
  category VARCHAR(30) CHECK (category IN ('minimalist', 'dark', 'light', 'pop_culture', 'custom', 'other')),
  author_name VARCHAR(50),
  reddit_username VARCHAR(30),
  instagram_username VARCHAR(30),
  file_url TEXT NOT NULL,           -- URL Supabase Storage
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  flags_count INTEGER NOT NULL DEFAULT 0,
  hidden BOOLEAN DEFAULT false,     -- Modération
  submitted_ip_hash VARCHAR(64) NOT NULL,  -- Rate limiting
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `feature_requests`
Tableau de demandes de fonctionnalités avec votes
```sql
CREATE TABLE feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(80) NOT NULL,
  description VARCHAR(500) NOT NULL,
  reddit_username VARCHAR(30),      -- Nullable
  tags TEXT[] DEFAULT '{}',
  votes_count INTEGER NOT NULL DEFAULT 0,
  warnings_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  hidden BOOLEAN DEFAULT false,     -- Modération
  admin_status TEXT DEFAULT 'pending' CHECK (admin_status IN ('pending', 'planned', 'completed', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `location_declarations`
Déclarations de localisation pour carte mondiale
```sql
CREATE TABLE location_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL,  -- ISO 3166-1 alpha-2
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### `analytics`
Statistiques globales (téléchargements, vues)
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdf_downloads INTEGER DEFAULT 0,
  pdf_v2_downloads INTEGER DEFAULT 0,
  epub_v2_downloads INTEGER DEFAULT 0,
  csv_downloads INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Tables Auxiliaires

#### `feature_votes`
Tracking des votes (prévention doublons par IP hash)
```sql
CREATE TABLE feature_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  ip_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(feature_request_id, ip_hash)
);
```

#### `submission_limits`
Rate limiting pour soumissions (par IP hash)
```sql
CREATE TABLE submission_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash VARCHAR(64) NOT NULL UNIQUE,
  submission_count INTEGER NOT NULL DEFAULT 0,
  last_submission_at TIMESTAMPTZ,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);
```

### Row Level Security (RLS)

**Principe** : Toutes les tables ont RLS activé. Politiques pour :
- **Lecture publique** : Contenu `hidden = false` ET statut approprié
- **Écriture publique** : INSERT uniquement (pour soumissions)
- **Modification admin** : UPDATE/DELETE via service role key

**Exemple pour `resources`** :
```sql
-- Politique de lecture publique
CREATE POLICY "Public can read approved and visible resources" 
ON resources FOR SELECT 
TO public 
USING (status = 'approved' AND (hidden = false OR hidden IS NULL));

-- Politique d'insertion publique
CREATE POLICY "Allow public insert to resources"
ON resources FOR INSERT
TO public
WITH CHECK (true);

-- Politique d'update admin (service role bypass RLS)
CREATE POLICY "Allow admin updates to resources"
ON resources FOR UPDATE
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);
```

### Functions PostgreSQL

#### `increment_resource_downloads`
```sql
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE resources
  SET downloads_count = downloads_count + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;
```

#### `increment_wallpaper_downloads`
Similaire pour wallpapers.

### Indexes

Index sur colonnes fréquemment queryées :
- `resources.status`, `resources.hidden`, `resources.type`
- `wallpapers.status`, `wallpapers.hidden`, `wallpapers.category`
- `feature_requests.status`, `feature_requests.votes_count`
- `location_declarations.country_code`

---

## 🔌 API Routes Architecture

### Pattern Général

Toutes les routes API sont dans `src/pages/api/**/*.ts` et suivent le pattern Astro :
```typescript
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, params }) => {
  // Handler logic
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Routes Publiques

#### Resources
- `GET /api/resources` : Liste ressources (query params: `type`, `status`, `limit`, `offset`)
- `POST /api/resources` : Créer ressource (file upload ou external link)
- `GET /api/resources/[id]` : Détails d'une ressource
- `GET /api/resources/[id]/download` : Télécharger fichier (tracking downloads)
- `POST /api/resources/upload` : Upload fichier vers Supabase Storage

#### Wallpapers
- `GET /api/wallpapers` : Liste wallpapers (query params: `category`, `limit`)
- `POST /api/wallpapers` : Upload wallpaper (image + metadata)
- `GET /api/wallpapers/[id]/download` : Télécharger wallpaper (tracking downloads)

#### Feature Requests
- `GET /api/feature-requests` : Liste feature requests
- `POST /api/feature-requests` : Créer feature request
- `POST /api/feature-requests/[id]/vote` : Voter (IP hash tracking)

#### Location
- `GET /api/location` : Liste déclarations
- `POST /api/location` : Déclarer localisation
- `GET /api/location/stats` : Statistiques par pays

#### Analytics
- `POST /api/analytics/[action]` : Incrémenter compteurs (`pdf-v2-download`, `epub-v2-download`, etc.)

### Routes Admin (Protégées)

**Protection** : Cookie `admin_session === 'authenticated'`

- `POST /api/admin/resources/[id]/toggle` : Toggle `hidden` status
- `POST /api/admin/wallpapers/[id]/toggle` : Toggle `hidden` status
- `POST /api/admin/features/[id]/update` : Update `hidden` ou `admin_status`
- `POST /api/admin/logout` : Déconnexion admin

### Clients Supabase

#### Client Public (`src/lib/supabase/client.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
```
- Utilisé pour les opérations publiques (lecture, INSERT)
- Respecte RLS policies

#### Client Admin (`src/lib/supabase/admin.ts`)
```typescript
export function getSupabaseAdmin() {
  return createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,  // Bypass RLS
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
```
- Utilisé pour les opérations admin (UPDATE, DELETE)
- **Bypass complètement RLS**
- Uniquement côté serveur (API routes, pages admin)

---

## 🌐 Système d'Internationalisation

### Structure

#### Dictionnaire (`src/i18n/languages.ts`)
```typescript
export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.resources': 'Resources',
    'common.download': 'Download',
    'resources.title': 'Community Resources',
    // ... 800+ clés
  },
  fr: {
    'nav.home': 'Accueil',
    // ... traductions FR
  },
  // ... autres langues
} as const;
```

#### Helper (`src/i18n/utils.ts`)
```typescript
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: UIKey, params?: Record<string, string | number>) {
    let translation = ui[lang][key] || ui['en'][key] || key;
    // Replace {param} avec valeurs
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    return translation;
  }
}
```

### Routing i18n

**Configuration Astro** (`astro.config.mjs`) :
```javascript
i18n: {
  defaultLocale: "en",
  locales: ["en", "fr", "es", "ru", "cn"],
  routing: {
    prefixDefaultLocale: false  // EN sans préfixe
  }
}
```

**Pages** :
- `/` → EN (default)
- `/fr/resources` → FR
- `/es/resources` → ES
- etc.

**Pattern dans pages** :
```astro
---
const { lang = 'en' } = Astro.props;
const t = useTranslations(lang);
const langPrefix = lang === 'en' ? '' : `/${lang}`;
---

<h1>{t('resources.title')}</h1>
```

### Client-Side Translations

Pour JS dans composants Astro :
```html
<script define:vars={{ lang, translations: clientTranslations }}>
  window.__LANG__ = lang;
  window.__I18N__ = translations;
  window.t = (key, params) => {
    const text = translations[key] || key;
    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => 
        acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)), text
      );
    }
    return text;
  };
</script>
```

Utilisation :
```javascript
const t = window.t || ((key) => key);
const text = t('common.download');
```

---

## 🔐 Authentification Admin

### Système Simple

**Pas d'authentification Supabase Auth**. Système custom via cookie :

1. **Login** (`/admin`) : Formulaire avec `ADMIN_PASSWORD` (env var)
2. **Cookie** : `admin_session = 'authenticated'` (24h, httpOnly, secure)
3. **Protection** : Vérification cookie dans pages/admin et API routes

**Code exemple** :
```typescript
// Page admin
const adminCookie = Astro.cookies.get('admin_session');
if (adminCookie?.value !== 'authenticated') {
  return Astro.redirect('/admin');
}

// API route
export const POST: APIRoute = async ({ cookies }) => {
  const adminCookie = cookies.get('admin_session');
  if (adminCookie?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401
    });
  }
  // ... admin logic avec getSupabaseAdmin()
};
```

---

## 📤 Upload et Storage

### Supabase Storage

**Buckets** :
- `resources` : Fichiers uploadés (ressources)
- `wallpapers` : Images wallpapers

### Upload Pattern

#### 1. Upload via API route (`POST /api/resources/upload`)
```typescript
const formData = await request.formData();
const file = formData.get('file') as File;

// Upload vers Supabase Storage
const { data, error } = await supabaseAdmin.storage
  .from('resources')
  .upload(`${Date.now()}-${file.name}`, file, {
    contentType: file.type,
    upsert: false
  });

// Récupérer URL publique
const { data: { publicUrl } } = supabaseAdmin.storage
  .from('resources')
  .getPublicUrl(data.path);

return new Response(JSON.stringify({ url: publicUrl }));
```

#### 2. Créer ressource avec URL
```typescript
POST /api/resources
{
  "title": "...",
  "file_url": "https://...supabase.co/storage/v1/object/public/resources/..."
}
```

### Download Pattern

**Route download** (`GET /api/resources/[id]/download`) :
1. Récupérer ressource depuis DB
2. Vérifier statut (`approved`, `hidden = false`)
3. Incrémenter compteur (async, non-bloquant)
4. Fetch fichier depuis Supabase Storage
5. Retourner avec `Content-Disposition: attachment` pour force download

---

## 📊 Analytics et Tracking

### Système Simple

**Table `analytics`** avec une seule ligne (singleton) :
```typescript
// Incrémenter compteur
POST /api/analytics/pdf-v2-download

// Code
const { data } = await supabaseAdmin
  .from('analytics')
  .select('id, pdf_v2_downloads')
  .single();

await supabaseAdmin
  .from('analytics')
  .update({ pdf_v2_downloads: (data.pdf_v2_downloads || 0) + 1 })
  .eq('id', data.id);
```

**Tracking downloads** :
- Compteurs par ressource (`downloads_count`)
- Compteurs globaux (`analytics` table)
- Tracking client-side : `onclick` handlers sur liens download

---

## 🚀 Déploiement Netlify

### Configuration

**`netlify.toml`** :
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "20"
```

**`astro.config.mjs`** :
```javascript
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // ...
});
```

### Variables d'Environnement

**Netlify Dashboard → Site Settings → Environment Variables** :
```
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=secret123
DEEPL_API_KEY=xxx:fx  (optionnel, pour traductions automatiques)
```

### Build Process

1. **Install** : `npm install`
2. **Build** : `npm run build` (génère `dist/`)
3. **Deploy** : Netlify déploie `dist/` avec SSR functions

---

## 🧪 Scripts Utilitaires

### Migration Données

**Scripts dans `/scripts`** :
- `sync-airtable-supabase.ts` : Synchroniser Airtable → Supabase
- `import-exports.ts` : Importer exports JSON/CSV
- `migrate-wallpapers.ts` : Migration wallpapers depuis ancien système

**Usage** :
```bash
npm run sync-airtable
npm run sync-airtable:dry-run
```

### Traductions

- `generate-tips-translations.ts` : Générer structure traductions
- `translate-tips.ts` : Traduire automatiquement (DeepL API)
- `resume-translations.ts` : Reprendre traductions interrompues

### Diagnostics

- `check-resource.ts` : Vérifier pourquoi ressource n'apparaît pas
- `check-rls-policies.ts` : Vérifier politiques RLS
- `test-supabase-connection.ts` : Tester connexion Supabase

---

## 🔄 Patterns et Conventions

### Composants Astro

**Structure** :
```astro
---
// Frontmatter (TypeScript)
import Component from '@/components/Component.astro';
const { prop } = Astro.props;
const t = useTranslations(lang);
---

<!-- HTML avec classes Tailwind -->
<div class="container mx-auto">
  <h1>{t('page.title')}</h1>
</div>

<!-- Script client-side si besoin -->
<script>
  // Client-side JS
</script>
```

### API Routes

**Pattern standard** :
```typescript
export const GET: APIRoute = async ({ request, params }) => {
  try {
    // Validation
    if (!params.id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Business logic
    const { data, error } = await supabase.from('table').select('*');

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    // Success
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
    });
  }
};
```

### Gestion d'Erreurs

**Toujours** :
- Logs côté serveur (`console.error`)
- Messages d'erreur détaillés en dev, génériques en prod
- Codes HTTP appropriés (400, 401, 403, 404, 500)
- Validation des inputs

### Rate Limiting

**Pattern IP hash** :
```typescript
const ip = request.headers.get('x-forwarded-for') || 'unknown';
const encoder = new TextEncoder();
const data = encoder.encode(ip);
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const ipHash = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');

// Vérifier limite
const { data: limit } = await supabase
  .from('submission_limits')
  .select('*')
  .eq('ip_hash', ipHash)
  .single();
```

---

## 🔍 Points d'Attention pour Refonte

### Architecture à Conserver

1. **Astro SSR** : Garder `output: 'server'` pour API routes
2. **Supabase** : Structure DB solide, garder RLS
3. **i18n custom** : Système flexible, facile à étendre
4. **Separation of concerns** : Client public vs Admin client

### Améliorations Possibles

1. **Authentication** : Migrer vers Supabase Auth (plus robuste)
2. **Rate limiting** : Middleware Astro au lieu de DB
3. **Caching** : Ajouter cache Redis pour requêtes fréquentes
4. **Validation** : Schema validation (Zod) pour API routes
5. **Error handling** : Middleware global d'erreurs

### Migration Données

**Si migration depuis ancien système** :
1. Exporter données depuis ancien système (JSON/CSV)
2. Scripts de transformation/mapping
3. Import via scripts (`scripts/import-exports.ts`)
4. Vérification données après import

---

## 📝 Checklist Setup Nouveau Projet

### 1. Initialisation
- [ ] Créer projet Astro : `npm create astro@latest`
- [ ] Configurer `astro.config.mjs` (SSR + adapter)
- [ ] Installer dépendances : Supabase, Tailwind, etc.

### 2. Supabase
- [ ] Créer projet Supabase
- [ ] Appliquer migrations SQL (dans ordre : 001, 003, 004, 006, 008, 009)
- [ ] Créer buckets Storage : `resources`, `wallpapers`
- [ ] Configurer RLS policies
- [ ] Créer functions PostgreSQL

### 3. Configuration
- [ ] Variables d'environnement (`.env`)
- [ ] Configurer `astro.config.mjs` (i18n, site URL)
- [ ] Configurer `tsconfig.json` (paths alias `@/*`)

### 4. Structure
- [ ] Créer structure dossiers (`src/components`, `src/pages`, etc.)
- [ ] Implémenter `BaseLayout`
- [ ] Créer clients Supabase (`client.ts`, `admin.ts`)
- [ ] Créer système i18n (`languages.ts`, `utils.ts`)

### 5. Fonctionnalités Core
- [ ] Pages publiques (home, resources, wallpapers, etc.)
- [ ] API routes (CRUD operations)
- [ ] Upload/Download files
- [ ] Admin panel

### 6. Déploiement
- [ ] Configurer Netlify (ou autre)
- [ ] Variables d'environnement sur plateforme
- [ ] Test déploiement
- [ ] Vérifier SSR functions

---

## 🎨 Design System (Alfred Theme)

### Composants Fondations

**Dans `src/components/fundations/`** :
- `Button.astro` : Variants (default, accent, muted), sizes (xs, sm, base, md, lg, xl)
- `Text.astro` : Variants de texte (displayLG, textLG, textSM, etc.)
- `Wrapper.astro` : Containers (standard, narrow, wide)
- `Link.astro` : Liens stylisés

**Pattern d'utilisation** :
```astro
<Button variant="default" size="lg">
  Click me
</Button>

<Text tag="h1" variant="displayLG">
  Title
</Text>

<Wrapper variant="standard">
  Content
</Wrapper>
```

---

## 🔗 URLs et Routing

### URLs Publiques

```
/                          → Home (EN)
/fr                       → Home (FR)
/resources                → Resources (EN)
/fr/resources             → Resources (FR)
/wallpapers               → Wallpapers (EN)
/board                    → Feature Board (EN)
/tips                     → Tips & Tricks (EN)
/location                 → Global Map (EN)
/guide                    → Community Guide (EN)
/disclaimer               → Legal Disclaimer (EN)
```

### URLs Admin

```
/admin                    → Login
/admin/resources          → Manage Resources
/admin/wallpapers         → Manage Wallpapers
/admin/features           → Manage Features
```

### URLs API

```
/api/resources            → GET (list), POST (create)
/api/resources/[id]       → GET (detail)
/api/resources/[id]/download → GET (download file)
/api/admin/resources/[id]/toggle → POST (admin: toggle hidden)
```

---

## 🧰 Outils de Développement

### Commands NPM

```bash
npm run dev              # Dev server (localhost:4322)
npm run build            # Build production
npm run preview          # Preview build local
npm run sync-airtable    # Sync Airtable → Supabase
npm run check-resource   # Diagnostic ressource
```

### Debugging

**Logs serveur** : `console.log` / `console.error` dans API routes  
**Logs client** : `console.log` dans `<script>` tags  
**Supabase logs** : Dashboard → Logs → API

---

## ✅ Tests de Validation

### Fonctionnalités à Tester

1. **Navigation** : Toutes les pages accessibles
2. **i18n** : Changer langue, vérifier traductions
3. **CRUD** : Créer, lire, modifier, supprimer ressources
4. **Upload** : Upload fichier, vérifier dans Storage
5. **Download** : Télécharger ressource, vérifier compteur
6. **Admin** : Login, modération, toggle hidden
7. **RLS** : Vérifier que contenu caché n'est pas visible publiquement

---

## 📚 Documentation Additionnelle

**Références** :
- [Astro Docs](https://docs.astro.build)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Netlify SSR](https://docs.netlify.com/integrations/frameworks/astro/)

---

**Fin du guide** - Bonne refonte ! 🚀

