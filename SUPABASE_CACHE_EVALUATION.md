# Évaluation : Implémentation d'un cache Supabase

## 📊 Analyse de la situation actuelle

### Statistiques
- **187 requêtes Supabase** réparties sur **60 fichiers**
- Mode **SSR (Server-Side Rendering)** avec Astro
- Déploiement sur **Vercel**
- Pas de système de cache actuellement implémenté

### Points chauds identifiés

#### 1. Page d'accueil (`/` et `/[lang]`)
- **3 requêtes par visite** :
  - Latest resources (limite 6)
  - Latest wallpapers (limite 4)
  - Latest news (limite 3)
- **Impact** : Très haute fréquence, données relativement statiques

#### 2. Pages de listing avec pagination
- **Wallpapers** (`/wallpapers` et `/[lang]/wallpapers`) :
  - 1 requête pour les données (24 items)
  - 1 requête `count` avec `head: true` (très coûteuse en Cached Egress)
- **News** (`/news` et `/[lang]/news`) :
  - 1 requête pour les données (12 items)
  - 1 requête `count` avec `head: true`
- **Resources** (`/resources` et `/[lang]/resources`) :
  - 1 requête pour les données (50 items)

#### 3. API Endpoints
- `/api/news/index.ts` : 2 requêtes (données + count)
- `/api/wallpapers/index.ts` : Requêtes fréquentes
- `/api/resources/index.ts` : Requêtes fréquentes

### Problèmes spécifiques

1. **Requêtes `count` coûteuses** :
   - Utilisation de `select('*', { count: 'exact', head: true })`
   - Chaque requête count = 1 unité de Cached Egress
   - Répétées sur chaque page de pagination

2. **Données répétitives** :
   - Les "latest" items changent rarement
   - Pas de cache = requête DB à chaque visite

3. **Multi-langue** :
   - Même données pour toutes les langues
   - 5 langues × mêmes requêtes = 5× la consommation

## 🎯 Solutions de cache évaluées

### Option 1 : Astro.cache() (Recommandé ⭐)

**Avantages** :
- ✅ Natif à Astro, pas de dépendance externe
- ✅ Intégré avec le système de rendu SSR
- ✅ Support des headers HTTP (Cache-Control)
- ✅ Simple à implémenter
- ✅ Compatible avec Vercel Edge/Serverless

**Inconvénients** :
- ⚠️ Cache limité à la durée de vie de la requête (pas de cache persistant entre builds)
- ⚠️ Nécessite une configuration manuelle pour chaque requête

**Implémentation** :
```typescript
// Exemple pour la page d'accueil
const cacheKey = `latest-resources-${lang}`;
const cached = await Astro.cache.get(cacheKey);
if (cached) return cached;

const { data } = await supabase.from('resources')...;
await Astro.cache.set(cacheKey, data, { ttl: 300 }); // 5 minutes
```

**Réduction estimée** : 60-80% des requêtes répétitives

---

### Option 2 : @supabase-cache-helpers/postgrest-server

**Avantages** :
- ✅ Spécialement conçu pour Supabase
- ✅ Support stale-while-revalidate
- ✅ Génération automatique de clés de cache
- ✅ Intégration avec différents backends de cache

**Inconvénients** :
- ⚠️ Nécessite une dépendance externe
- ⚠️ Configuration plus complexe
- ⚠️ Nécessite un backend de cache (Redis, etc.)

**Implémentation** :
```typescript
import { createServerClient } from '@supabase-cache-helpers/postgrest-server';
// Nécessite un adaptateur de cache (Redis, Memory, etc.)
```

**Réduction estimée** : 70-90% avec Redis

---

### Option 3 : Cache HTTP avec Vercel Edge

**Avantages** :
- ✅ Cache au niveau CDN (Edge)
- ✅ Réduction maximale des requêtes DB
- ✅ Headers Cache-Control automatiques
- ✅ Gratuit avec Vercel

**Inconvénients** :
- ⚠️ Invalidation du cache plus complexe
- ⚠️ Peut servir des données obsolètes plus longtemps

**Implémentation** :
```typescript
// Dans les API routes
export const GET: APIRoute = async ({ request }) => {
  // ... requête Supabase
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  });
};
```

**Réduction estimée** : 80-95% pour les données statiques

---

### Option 4 : Supacache (Cloudflare Workers)

**Avantages** :
- ✅ Proxy de cache dédié
- ✅ Compression automatique
- ✅ Chiffrement
- ✅ TTL par requête

**Inconvénients** :
- ⚠️ Nécessite Cloudflare Workers (changement d'infrastructure)
- ⚠️ Coût supplémentaire potentiel
- ⚠️ Complexité d'implémentation

**Réduction estimée** : 90-95% mais nécessite migration

---

## 💡 Recommandation : Approche hybride

### Phase 1 : Cache HTTP simple (Quick Win) 🚀

**Priorité** : Immédiate
**Effort** : Faible (2-3 heures)
**Impact** : Réduction de 40-60% des requêtes

1. Ajouter des headers Cache-Control aux API routes
2. Utiliser Astro.cache() pour les requêtes dans les pages
3. Cacher les requêtes `count` (TTL: 5-10 minutes)

**Fichiers à modifier** :
- `src/pages/api/news/index.ts`
- `src/pages/api/wallpapers/index.ts`
- `src/pages/api/resources/index.ts`
- `src/pages/index.astro`
- `src/pages/wallpapers/index.astro`
- `src/pages/news/index.astro`

### Phase 2 : Cache intelligent avec Astro.cache() (Recommandé) ⭐

**Priorité** : Court terme (1-2 semaines)
**Effort** : Moyen (1-2 jours)
**Impact** : Réduction de 60-80% des requêtes

1. Créer un wrapper de cache pour Supabase
2. Implémenter un système de clés de cache intelligentes
3. Cache différencié par type de données :
   - Latest items : 2-5 minutes
   - Count queries : 5-10 minutes
   - Données de pagination : 1-2 minutes
   - Données statiques : 15-30 minutes

**Structure proposée** :
```
src/lib/supabase/
  ├── client.ts (existant)
  ├── cache.ts (nouveau - wrapper de cache)
  └── cached-queries.ts (nouveau - helpers)
```

### Phase 3 : Optimisation avancée (Optionnel)

**Priorité** : Moyen terme
**Effort** : Élevé
**Impact** : Réduction supplémentaire de 10-15%

1. Implémenter stale-while-revalidate
2. Cache Redis pour les données très fréquentes
3. Pré-calcul des counts dans une table dédiée

---

## 📈 Estimation des gains

### Avant optimisation
- **Requêtes/jour estimées** : ~50,000-100,000
- **Cached Egress** : ~10-20 GB/jour
- **Coût mensuel estimé** : Variable selon plan Supabase

### Après Phase 1 (Cache HTTP)
- **Réduction** : 40-60%
- **Requêtes/jour** : ~20,000-40,000
- **Cached Egress** : ~4-8 GB/jour

### Après Phase 2 (Astro.cache())
- **Réduction** : 60-80%
- **Requêtes/jour** : ~10,000-20,000
- **Cached Egress** : ~2-4 GB/jour

### Après Phase 3 (Optimisation avancée)
- **Réduction** : 80-90%
- **Requêtes/jour** : ~5,000-10,000
- **Cached Egress** : ~1-2 GB/jour

---

## 🛠️ Plan d'implémentation recommandé

### Étape 1 : Créer un wrapper de cache (2h)

Créer `src/lib/supabase/cache.ts` :
- Fonction `cachedQuery()` qui wrap les requêtes Supabase
- Génération automatique de clés de cache
- Support de TTL personnalisé
- Fallback si cache échoue

### Étape 2 : Migrer les requêtes critiques (4h)

1. Page d'accueil (3 requêtes)
2. Pages wallpapers (2 requêtes)
3. Pages news (2 requêtes)
4. API endpoints principaux

### Étape 3 : Ajouter headers HTTP (1h)

Ajouter Cache-Control headers aux réponses API

### Étape 4 : Monitoring et ajustement (ongoing)

- Surveiller les métriques Supabase
- Ajuster les TTL selon les besoins
- Identifier d'autres points d'optimisation

---

## ⚠️ Points d'attention

1. **Invalidation du cache** :
   - Quand de nouvelles données sont ajoutées (admin)
   - Stratégie : TTL court + invalidation manuelle si nécessaire

2. **Données utilisateur** :
   - Ne pas cacher les données sensibles
   - Ne pas cacher les données personnalisées

3. **Stale data** :
   - Accepter quelques secondes de délai pour les données "latest"
   - Utiliser stale-while-revalidate quand possible

4. **Multi-langue** :
   - Inclure la langue dans la clé de cache
   - Même données = même cache (optimisation possible)

---

## 📝 Conclusion

**Recommandation finale** : Implémenter **Phase 1 + Phase 2** avec Astro.cache()

**Raisons** :
1. ✅ Pas de dépendance externe
2. ✅ Intégration native avec Astro
3. ✅ Effort modéré pour gain significatif
4. ✅ Compatible avec l'infrastructure actuelle (Vercel)
5. ✅ Facile à maintenir et déboguer

**Gain estimé** : 60-80% de réduction des requêtes et Cached Egress

**Prochaine étape** : Implémenter le wrapper de cache et migrer les requêtes critiques.
