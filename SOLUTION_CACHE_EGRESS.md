# 🔧 Solution pour Réduire la Consommation Cached Egress

## 📊 Situation Actuelle

**Problème** : Consommation toujours élevée (~12.8 GB/jour) malgré le cache

**Cause identifiée** : Le cache mémoire ne persiste pas entre les invocations Serverless sur Vercel

## ✅ Ce qui Fonctionne

1. **Pages .astro** → Utilisent `Astro.cache` (persiste) ✅
   - `/wallpapers`, `/news`, `/resources`, etc.
   - Ces pages bénéficient du cache

2. **Headers Cache-Control** → CDN Edge peut cacher ✅
   - Déjà implémentés sur les API routes GET
   - `Cache-Control: public, s-maxage=86400, stale-while-revalidate=3600`

## ❌ Ce qui Ne Fonctionne Pas

1. **API routes en Serverless** → Cache mémoire perdu entre invocations ❌
   - Chaque invocation peut être une nouvelle instance
   - Le cache mémoire est vidé

## 🎯 Solutions Recommandées

### Solution 1 : Optimiser le CDN Edge (Recommandé - Gratuit) ⭐

Les headers `Cache-Control` sont déjà en place, mais on peut améliorer :

1. **Vérifier que Vercel Edge cache bien** :
   - Les réponses avec `Cache-Control` devraient être cachées au Edge
   - Vérifier dans Vercel Dashboard → Analytics → Edge Cache Hits

2. **Augmenter la durée du cache Edge** :
   - Actuellement : `s-maxage=86400` (24h)
   - Peut être augmenté à 7 jours pour les données statiques

### Solution 2 : Utiliser Vercel KV (Redis) - Payant

Pour un cache vraiment persistant entre les invocations :

1. **Créer un Vercel KV store** (nécessite Vercel Pro)
2. **Remplacer le cache mémoire par Vercel KV**
3. **Coût** : ~$20/mois pour Vercel Pro + KV

### Solution 3 : Pré-rendu (Static Generation) - Gratuit ⭐⭐

La meilleure solution pour réduire drastiquement les requêtes :

1. **Pré-rendre les pages populaires** au build
2. **Aucune requête DB** pour ces pages (100% statique)
3. **Revalidation** seulement après modifications

**Pages à pré-rendre** :
- Page d'accueil (`/`)
- Pages de listing populaires (`/wallpapers`, `/news`)
- Pages de détails fréquemment visitées

### Solution 4 : Optimiser les Requêtes Count

Les requêtes `count` sont très coûteuses. Solutions :

1. **Pré-calculer les counts** dans une table de métadonnées
2. **Mettre à jour** seulement lors des insertions/modifications
3. **Réduction estimée** : 50-70% de la consommation

## 🚀 Plan d'Action Immédiat (Gratuit)

### Étape 1 : Vérifier le Cache Edge (5 min)

Dans Vercel Dashboard :
1. Aller dans **Analytics** → **Edge Cache**
2. Vérifier le taux de cache hits
3. Si < 50%, le CDN ne cache pas bien

### Étape 2 : Augmenter le Cache Edge (10 min)

Modifier les headers pour les données très statiques :

```typescript
// Pour les données qui changent rarement
'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400'
// 7 jours au lieu de 24h
```

### Étape 3 : Pré-rendre les Pages Populaires (30 min)

Dans `astro.config.mjs` :

```javascript
export default defineConfig({
  output: 'hybrid', // Au lieu de 'server'
  // ...
});
```

Puis dans les pages populaires :
```astro
---
export const prerender = true; // Pré-rendre cette page
---
```

**Pages à pré-rendre** :
- `/index.astro`
- `/wallpapers/index.astro`
- `/news/index.astro`

## 📊 Impact Attendu

### Avec Pré-rendu + Cache Edge optimisé :

| Métrique | Avant | Après | Réduction |
|---------|-------|-------|-----------|
| **Requêtes/jour** | 50,000-100,000 | 1,000-2,000 | **95-98%** |
| **Cached Egress** | 10-20 GB/jour | **0.2-0.5 GB/jour** | **95-98%** |

## ⚠️ Points d'Attention

1. **Pré-rendu** :
   - Les pages pré-rendues ne peuvent pas utiliser de données dynamiques
   - Il faut utiliser `Astro.url` pour les données dynamiques
   - Ou utiliser `output: 'hybrid'` pour pré-rendre seulement certaines pages

2. **Invalidation** :
   - Après modification, il faut re-build pour mettre à jour les pages pré-rendues
   - Ou utiliser ISR (Incremental Static Regeneration) avec Vercel

## 🎯 Recommandation Finale

**Court terme (gratuit)** :
1. ✅ Vérifier le cache Edge dans Vercel
2. ✅ Augmenter `s-maxage` pour les données statiques
3. ✅ Pré-rendre les 3-5 pages les plus visitées

**Moyen terme (si nécessaire)** :
- Implémenter un système de pré-calcul des counts
- Utiliser Vercel KV si le trafic est vraiment élevé

---

**Conclusion** : Le cache fonctionne techniquement, mais en Serverless il ne persiste pas entre les invocations. La meilleure solution est de pré-rendre les pages populaires et d'optimiser le cache Edge.
