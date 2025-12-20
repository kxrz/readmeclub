# Exemple de migration vers le cache

Ce document montre comment migrer les requêtes Supabase existantes vers le système de cache.

## Avant (sans cache)

```typescript
// src/pages/index.astro
const { data: latestResources } = await supabase
  .from('resources')
  .select('*')
  .eq('status', 'approved')
  .eq('hidden', false)
  .order('created_at', { ascending: false })
  .limit(6);
```

## Après (avec cache)

```typescript
// src/pages/index.astro
import { cachedQuery, CacheKeys } from '@/lib/supabase/cache';

const { data: latestResources } = await cachedQuery(
  () => supabase
    .from('resources')
    .select('*')
    .eq('status', 'approved')
    .eq('hidden', false)
    .order('created_at', { ascending: false })
    .limit(6),
  {
    key: CacheKeys.latestResources(lang),
    ttl: 300, // 5 minutes
    lang,
  }
);
```

---

## Exemple complet : Page Wallpapers

### Avant

```typescript
// src/pages/wallpapers/index.astro
let query = supabase
  .from('wallpapers')
  .select('*')
  .eq('status', 'published')
  .eq('hidden', false);

if (category) {
  query = query.eq('category', category);
}

if (sort === 'popular') {
  query = query.order('download_count', { ascending: false });
} else if (sort === 'name') {
  query = query.order('title', { ascending: true, nullsFirst: false });
} else if (sort === 'author') {
  query = query.order('author_name', { ascending: true, nullsFirst: false });
} else {
  query = query.order('created_at', { ascending: false });
}

query = query.range(from, to);

const { data: rawWallpapers } = await query;
const wallpapers = rawWallpapers ? rawWallpapers.slice(0, pageSize) : [];

// Count query (très coûteuse)
const { count: wallpapersCount } = await supabase
  .from('wallpapers')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'published')
  .eq('hidden', false);
```

### Après

```typescript
// src/pages/wallpapers/index.astro
import { cachedQuery, cachedCount, CacheKeys } from '@/lib/supabase/cache';

// Query avec cache (TTL court car données de pagination)
const { data: rawWallpapers } = await cachedQuery(
  () => {
    let query = supabase
      .from('wallpapers')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false);

    if (category) {
      query = query.eq('category', category);
    }

    if (sort === 'popular') {
      query = query.order('download_count', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('title', { ascending: true, nullsFirst: false });
    } else if (sort === 'author') {
      query = query.order('author_name', { ascending: true, nullsFirst: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    return query.range(from, to);
  },
  {
    key: CacheKeys.wallpapersPage(page, category || undefined, sort),
    ttl: 120, // 2 minutes (données de pagination)
    lang,
    parts: [page, category, sort],
  }
);

const wallpapers = rawWallpapers ? rawWallpapers.slice(0, pageSize) : [];

// Count query avec cache (TTL plus long car change moins souvent)
const { data: wallpapersCount } = await cachedCount(
  () => supabase
    .from('wallpapers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('hidden', false),
  {
    key: CacheKeys.wallpapersCount(),
    ttl: 600, // 10 minutes
  }
);
```

---

## Exemple : API Route

### Avant

```typescript
// src/pages/api/news/index.ts
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '12');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .eq('hidden', false)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  const { count } = await supabase
    .from('news')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('hidden', false);
  
  return new Response(JSON.stringify({ data, total: count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Après (avec cache + headers HTTP)

```typescript
// src/pages/api/news/index.ts
import { cachedQuery, cachedCount, CacheKeys } from '@/lib/supabase/cache';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '12');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const page = Math.floor(offset / limit) + 1;
  
  // Query avec cache
  const { data, error } = await cachedQuery(
    () => supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1),
    {
      key: CacheKeys.newsPage(page),
      ttl: 180, // 3 minutes
      parts: [page, limit],
    }
  );
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Count avec cache
  const { data: count } = await cachedCount(
    () => supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('hidden', false),
    {
      key: CacheKeys.newsCount(),
      ttl: 600, // 10 minutes
    }
  );
  
  return new Response(
    JSON.stringify({ 
      data: data || [], 
      total: count || 0,
      limit,
      offset 
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache HTTP pour le CDN
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360',
      },
    }
  );
};
```

---

## TTL recommandés par type de données

| Type de données | TTL recommandé | Raison |
|----------------|----------------|--------|
| Latest items (homepage) | 2-5 minutes | Changent relativement souvent |
| Données de pagination | 1-2 minutes | Peuvent changer avec nouvelles soumissions |
| Count queries | 5-10 minutes | Changent moins souvent |
| Données statiques | 15-30 minutes | Rarement modifiées |
| Données utilisateur | Pas de cache | Données personnelles |

---

## Notes importantes

1. **Gestion des erreurs** : Le cache retourne toujours un objet avec `data`, `error`, et `fromCache`
2. **Fallback** : Si le cache échoue, la requête est exécutée normalement
3. **Invalidation** : Pour invalider le cache après une modification admin, utiliser `clearCache()`
4. **Monitoring** : Surveiller les métriques Supabase pour ajuster les TTL
