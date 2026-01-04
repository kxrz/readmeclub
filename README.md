# Xteink Community Hub

Community platform for sharing and discovering resources for Xteink.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Installation

1. Clone the project
```bash
git clone <repository-url>
cd xteinkhub2026
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your Supabase keys
```

4. Set up Supabase

- Create a project on [Supabase](https://supabase.com)
- Create Storage buckets: `resources` and `wallpapers` (public)
- Run SQL migrations in order:
  - `supabase/migrations/001_initial_schema.sql`
  - `supabase/migrations/002_rls_policies.sql`

5. Start the development server
```bash
npm run dev
```

The site will be accessible at `http://localhost:4321`

## 📁 Project Structure

```
├── src/
│   ├── components/       # Reusable Astro components
│   ├── pages/           # Astro routes (pages + API)
│   ├── layouts/         # Astro layouts
│   ├── lib/             # Utilities and clients
│   │   ├── supabase/    # Supabase clients
│   │   └── utils/       # Utilities (rate limiting, etc.)
│   ├── i18n/            # Internationalization system
│   └── styles/          # Global styles
├── supabase/
│   └── migrations/      # SQL migrations
└── public/              # Static assets
```

## 🌐 Internationalization

The site supports 5 languages:
- EN (English) - default language
- FR (French)
- ES (Spanish)
- RU (Russian)
- CN (Chinese)

Translations are in `src/i18n/languages.ts`.

## 🗄️ Database

### Main tables

- `resources` : Community resources catalog
- `wallpapers` : Wallpaper gallery
- `feature_requests` : Feature requests with voting
- `location_declarations` : Location declarations
- `analytics` : Global statistics

### Supabase Storage

- `resources` bucket : Uploaded files (resources)
- `wallpapers` bucket : Wallpaper images

## 🔐 Administration

Administration is done via a simple cookie system:
- Login page: `/admin`
- Password defined in `ADMIN_PASSWORD`
- `admin_session` cookie valid for 24h

## 📤 API Routes

### Resources

- `GET /api/resources` : List resources
- `POST /api/resources` : Create a resource
- `GET /api/resources/[id]` : Resource details
- `GET /api/resources/[id]/download` : Download a resource
- `POST /api/resources/upload` : File upload

### Rate Limiting

- Maximum 5 submissions per IP every 24h
- Tracking via SHA-256 hash of IP

## 🚀 Deployment on Vercel

1. Connect the repository to Vercel
2. Configure environment variables in Vercel Dashboard
3. Deploy automatically via Git

The project uses the `@astrojs/vercel/serverless` adapter for SSR.

## 📝 Available Scripts

- `npm run dev` : Development server
- `npm run build` : Production build
- `npm run preview` : Preview local build
- `./scripts/check-secrets.sh` : Verify no secrets are in code before commit

## 🛠️ Technologies Used

- **Astro 5** : SSR framework
- **Tailwind CSS 4** : Styling
- **Supabase** : Database + Storage
- **TypeScript** : Static typing
- **Zod** : Schema validation

## 🔒 Security

**⚠️ IMPORTANT**: This project is open-source. Never commit secrets or `.env` files.

- **👉 Start here**: `PRE_COMMIT_CHECKLIST.md` - Step-by-step checklist before every commit
- See `SECURITY.md` for security best practices
- See `CONTRIBUTING.md` for contribution guide
- Use `./scripts/check-secrets.sh` before each commit

## 📚 Documentation

- `PRE_COMMIT_CHECKLIST.md` : **Pre-commit checklist** (use this before every commit!)
- `PROJECT_MIGRATION_GUIDE.md` : Architecture details
- `designsystem.md` : Complete design system
- `SECURITY.md` : Security policy
- `CONTRIBUTING.md` : Contribution guide
