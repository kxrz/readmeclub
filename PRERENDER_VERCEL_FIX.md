# ⚠️ Pré-rendu avec Vercel - Points d'Attention

## Problème Connu avec `output: 'hybrid'` sur Vercel

D'après [astro-vercel-api-fix](https://github.com/kxrz/astro-vercel-api-fix), le mode `hybrid` peut causer des problèmes sur Vercel :

- ❌ Erreurs 405 sur les API routes
- ❌ HTML au lieu de JSON
- ❌ `ERR_MODULE_NOT_FOUND`
- ❌ Routes traitées comme statiques au lieu de serverless

## ✅ Solution Implémentée

### 1. Configuration

```javascript
// astro.config.mjs
// output: 'static' est le défaut (depuis Astro 4+)
// Les pages avec prerender = true sont statiques, les autres sont SSR
adapter: vercel(),
```

**Note** : `output: 'hybrid'` a été supprimé dans Astro. Le comportement par défaut (`static`) permet maintenant le pré-rendu sélectif.

### 2. Protection des API Routes

**TOUTES les API routes doivent avoir** :
```typescript
export const prerender = false; // Critical!
```

**Vérification** : ✅ Toutes les API routes ont déjà `prerender = false`

### 3. Pages Pré-rendues

Les pages suivantes ont `export const prerender = true` :
- `/` (homepage)
- `/wallpapers` (listing)
- `/news` (listing)
- `/resources` (listing)
- `/[lang]/` (homepage localisée)
- `/[lang]/wallpapers` (listing localisé)
- `/[lang]/news` (listing localisé)

### 4. Pages Dynamiques

Les pages avec paramètres dynamiques restent en SSR :
- `/[id].astro` → `prerender = false` (implicite ou explicite)
- `/[slug].astro` → `prerender = false`
- Pages admin → `prerender = false`

## 🔍 Vérification Post-Déploiement

Après déploiement sur Vercel, vérifier :

1. **API Routes fonctionnent** :
   - Tester `/api/wallpapers`
   - Tester `/api/news`
   - Vérifier que les réponses sont en JSON, pas HTML

2. **Pages pré-rendues fonctionnent** :
   - Vérifier que les pages sont servies rapidement
   - Vérifier dans Vercel Dashboard → Functions (ne doivent pas apparaître)

3. **Logs Vercel** :
   - Les API routes doivent montrer des logs d'exécution
   - Pas de "HIT" (qui indiquerait un traitement statique)

## ⚠️ Si Problèmes

Si vous rencontrez des erreurs 405 ou du HTML au lieu de JSON :

1. **Vérifier que toutes les API routes ont `prerender = false`**
2. **Vérifier qu'il n'y a pas de `vercel.json` qui override la config**
3. **Vérifier qu'on utilise `@astrojs/vercel` (pas `/serverless`)**

## 📝 Checklist

- ✅ Pas de `output` explicite (utilise `static` par défaut, qui permet pré-rendu sélectif)
- ✅ Toutes les API routes ont `export const prerender = false`
- ✅ Pages à pré-rendre ont `export const prerender = true`
- ✅ Pas de `vercel.json` qui override
- ✅ Utilisation de `@astrojs/vercel` (moderne)

## 🔗 Références

- [Guide complet : astro-vercel-api-fix](https://github.com/kxrz/astro-vercel-api-fix)
- [Astro on Vercel Documentation](https://docs.astro.build/en/guides/integrations-guide/vercel/)
