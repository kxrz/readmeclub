# Implémentation du Cache Intelligent avec Invalidation Ciblée

## 🎯 Approche Retenue

Au lieu de cacher à la visite avec TTL court, nous utilisons une approche **invalidation manuelle** :
- **Cache avec TTL très long** (24h) - les données restent en cache jusqu'à modification
- **Invalidation ciblée** - seulement le type de contenu modifié est invalidé
- **Pré-génération automatique** - après insertion, les caches sont régénérés immédiatement

## 📊 Gains Estimés

### Avant optimisation
- **Requêtes/jour** : ~50,000-100,000
- **Cached Egress** : ~10-20 GB/jour
- **Requêtes count** : Très coûteuses, répétées à chaque visite

### Après optimisation (estimation)
- **Réduction** : **85-95%** des requêtes
- **Requêtes/jour** : ~2,500-5,000 (seulement lors des insertions/modifications)
- **Cached Egress** : ~0.5-1 GB/jour
- **Requêtes count** : Cachées, régénérées seulement après modification

### Pourquoi cette approche est meilleure

1. **Réduction drastique** : Les requêtes ne sont exécutées que lors des modifications, pas à chaque visite
2. **Invalidation intelligente** : Si on ajoute un wallpaper, seuls les caches wallpapers sont invalidés
3. **Pré-génération** : Les nouveaux caches sont créés immédiatement après insertion
4. **Pas de stale data** : Les données sont toujours à jour car invalidation immédiate

## 🏗️ Architecture

### Système de versioning

Chaque type de contenu a une version de cache :
- `cache:version:resources`
- `cache:version:wallpapers`
- `cache:version:news`

Quand on invalide, on incrémente la version → toutes les clés avec l'ancienne version deviennent invalides.

### Clés de cache

Format : `{type}:{subtype}:v{version}:{params}`

Exemples :
- `latest:resources:v5:en`
- `count:wallpapers:v3:all`
- `wallpapers:page:v2:1:all:latest`

### Flux de fonctionnement

#### Lecture (visite utilisateur)
1. Vérifie le cache avec la version actuelle
2. Si trouvé → retourne depuis le cache (0 requête DB)
3. Si non trouvé → exécute la requête et met en cache

#### Écriture (soumission/modification)
1. Insère/modifie dans la DB
2. Invalide le cache du type concerné (incrémente version)
3. Pré-génère les caches les plus fréquents (latest, count)
4. Retourne la réponse (non bloquante)

## 📁 Fichiers Modifiés

### Système de cache
- ✅ `src/lib/supabase/cache.ts` - Système de cache complet

### Pages migrées
- ✅ `src/pages/index.astro` - Page d'accueil
- ✅ `src/pages/[lang]/index.astro` - Page d'accueil localisée
- ✅ `src/pages/wallpapers/index.astro` - Liste wallpapers
- ✅ `src/pages/[lang]/wallpapers/index.astro` - Liste wallpapers localisée
- ✅ `src/pages/news/index.astro` - Liste news
- ✅ `src/pages/[lang]/news/index.astro` - Liste news localisée

### Routes API avec invalidation
- ✅ `src/pages/api/resources/index.ts` - POST resources
- ✅ `src/pages/api/wallpapers/index.ts` - POST wallpapers
- ✅ `src/pages/api/admin/news/index.ts` - POST news
- ✅ `src/pages/api/admin/resources/[id]/update.ts` - UPDATE resources
- ✅ `src/pages/api/admin/wallpapers/[id]/update.ts` - UPDATE wallpapers
- ✅ `src/pages/api/admin/news/[id]/update.ts` - UPDATE news

## 🔧 Utilisation

### Pour les développeurs

#### Lecture avec cache
```typescript
import { cachedQuery, CacheKeys } from '@/lib/supabase/cache';

const { data } = await cachedQuery(
  () => supabase.from('resources').select('*').limit(6),
  {
    key: await CacheKeys.latestResources(lang),
    ttl: 86400, // 24h
    lang,
    contentType: 'resources',
  }
);
```

#### Invalidation après modification
```typescript
import { invalidateCache, pregenerateCache } from '@/lib/supabase/cache';

// Après insertion/modification
await invalidateCache('resources');
await pregenerateCache('resources', supabaseClient);
```

## ⚠️ Points d'attention

1. **Requêtes de soumission** : Toujours fonctionnelles, le cache ne bloque jamais
2. **Erreurs de cache** : Ne font pas échouer les requêtes (fallback automatique)
3. **Multi-langue** : Chaque langue a son propre cache
4. **Pré-génération** : Se fait en arrière-plan, ne bloque pas la réponse

## 📈 Monitoring

Pour surveiller l'efficacité :
1. Vérifier les métriques Supabase (requêtes/jour, Cached Egress)
2. Logs de cache : `console.log` dans `cache.ts` pour voir les hits/misses
3. Versions de cache : Vérifier `cache:version:{type}` pour voir les invalidations

## 🚀 Prochaines optimisations possibles

1. **Cache Redis** : Pour cache distribué (si plusieurs instances)
2. **Cache CDN** : Headers HTTP Cache-Control pour Vercel Edge
3. **Pré-calcul des counts** : Table dédiée pour les counts (évite COUNT(*))
4. **Cache des pages complètes** : ISR (Incremental Static Regeneration)

## ✅ Validation

Pour tester que tout fonctionne :
1. ✅ Soumettre un nouveau resource → vérifier que ça apparaît après invalidation
2. ✅ Soumettre un nouveau wallpaper → vérifier que ça apparaît
3. ✅ Modifier le statut d'un élément admin → vérifier que le cache est mis à jour
4. ✅ Vérifier que les requêtes DB diminuent drastiquement dans Supabase
