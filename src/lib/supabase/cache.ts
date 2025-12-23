/**
 * Cache intelligent pour Supabase avec invalidation ciblée
 * 
 * Ce système permet de :
 * - Cacher les requêtes avec TTL très long (invalidation manuelle)
 * - Invalider seulement les caches concernés lors d'une modification
 * - Pré-générer les caches après insertion
 * 
 * Usage:
 * ```typescript
 * import { cachedQuery, invalidateCache } from '@/lib/supabase/cache';
 * 
 * // Lecture avec cache
 * const { data } = await cachedQuery(
 *   () => supabase.from('resources').select('*').limit(6),
 *   { key: 'latest-resources', ttl: 86400 } // 24h
 * );
 * 
 * // Invalidation ciblée après insertion
 * await invalidateCache('resources');
 * ```
 */

import type { PostgrestQueryBuilder } from '@supabase/postgrest-js';

interface CacheOptions {
  /** Clé de cache (générée automatiquement si non fournie) */
  key?: string;
  /** Time to live en secondes (défaut: 86400 = 24h, ou invalidation manuelle) */
  ttl?: number;
  /** Code langue pour cache multi-langue */
  lang?: string;
  /** Parties supplémentaires de la clé (params de requête, etc.) */
  parts?: (string | number | null | undefined)[];
  /** Type de contenu pour invalidation ciblée */
  contentType?: 'resources' | 'wallpapers' | 'news' | 'features';
}

interface CacheResult<T> {
  data: T | null;
  error: Error | null;
  fromCache: boolean;
}

/**
 * Génère une clé de cache à partir des paramètres
 */
function generateCacheKey(
  baseKey: string,
  options: CacheOptions = {}
): string {
  const parts = [baseKey];
  
  if (options.lang) {
    parts.push(`lang:${options.lang}`);
  }
  
  if (options.parts) {
    const validParts = options.parts
      .filter((p): p is string | number => p != null)
      .map(p => String(p));
    if (validParts.length > 0) {
      parts.push(...validParts);
    }
  }
  
  return parts.join(':');
}

/**
 * Cache en mémoire pour les API routes (quand Astro.cache n'est pas disponible)
 * 
 * Ce cache est partagé entre toutes les requêtes dans le même processus Node.js
 */
interface MemoryCacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, MemoryCacheEntry<any>>();

/**
 * Nettoie les entrées expirées du cache mémoire
 */
function cleanupMemoryCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Exécute une requête Supabase avec cache
 * 
 * Le cache persiste jusqu'à invalidation manuelle ou expiration du TTL
 * Utilise Astro.cache pour les pages .astro, et un cache mémoire pour les API routes
 * 
 * @param queryFn Fonction qui retourne un query builder Supabase
 * @param options Options de cache
 * @returns Résultat de la requête avec cache
 */
export async function cachedQuery<T = any>(
  queryFn: () => PostgrestQueryBuilder<any, any, any>,
  options: CacheOptions = {}
): Promise<CacheResult<T>> {
  // TTL par défaut très long (24h) car invalidation manuelle
  const { ttl = 86400 } = options;
  
  // Génère la clé de cache
  const cacheKey = options.key 
    ? generateCacheKey(options.key, options)
    : `supabase:${Date.now()}`;
  
  // Essaie d'abord Astro.cache (disponible dans les pages .astro)
  if (typeof Astro !== 'undefined' && Astro.cache) {
    try {
      const cached = await Astro.cache.get(cacheKey);
      if (cached) {
        // Log pour vérifier les cache hits (toujours affiché)
        console.log(`✅ Cache HIT (Astro.cache): ${cacheKey}`);
        return {
          data: cached as T,
          error: null,
          fromCache: true,
        };
      }
      // Cache miss
      console.log(`❌ Cache MISS (Astro.cache): ${cacheKey}`);
    } catch (error) {
      // Cache miss ou erreur - continue avec la requête
      console.warn(`Cache get failed for key ${cacheKey}:`, error);
    }
  }
  
  // Si Astro.cache n'est pas disponible, utilise le cache mémoire (pour API routes)
  cleanupMemoryCache(); // Nettoie les entrées expirées
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    console.log(`✅ Cache HIT (memory): ${cacheKey}`);
    return {
      data: memoryEntry.data as T,
      error: null,
      fromCache: true,
    };
  }
  
  if (memoryEntry) {
    console.log(`❌ Cache MISS (memory expired): ${cacheKey}`);
  } else {
    console.log(`❌ Cache MISS (memory): ${cacheKey}`);
  }
  
  // Exécute la requête
  try {
    const query = queryFn();
    const { data, error } = await query;
    
    if (error) {
      return {
        data: null,
        error: error as Error,
        fromCache: false,
      };
    }
    
    // Stocke dans Astro.cache (si disponible)
    if (typeof Astro !== 'undefined' && Astro.cache && data) {
      try {
        await Astro.cache.set(cacheKey, data, { ttl });
        console.log(`💾 Cache SET (Astro.cache): ${cacheKey} (TTL: ${ttl}s)`);
      } catch (error) {
        console.warn(`Cache set failed for key ${cacheKey}:`, error);
      }
    }
    
    // Stocke aussi dans le cache mémoire (pour API routes et partage entre processus)
    if (data) {
      const expiresAt = Date.now() + (ttl * 1000);
      memoryCache.set(cacheKey, { data, expiresAt });
      console.log(`💾 Cache SET (memory): ${cacheKey} (TTL: ${ttl}s)`);
      
      // Limite la taille du cache mémoire (évite les fuites mémoire)
      if (memoryCache.size > 1000) {
        // Supprime les 100 plus anciennes entrées
        const entries = Array.from(memoryCache.entries())
          .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
          .slice(0, 100);
        for (const [key] of entries) {
          memoryCache.delete(key);
        }
      }
    }
    
    return {
      data: data as T,
      error: null,
      fromCache: false,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      fromCache: false,
    };
  }
}

/**
 * Exécute une requête count avec cache
 * 
 * Les requêtes count sont très coûteuses en Cached Egress,
 * donc elles bénéficient grandement du cache.
 * 
 * @param queryFn Fonction qui retourne une requête count Supabase
 * @param options Options de cache
 * @returns Résultat count avec cache
 */
export async function cachedCount(
  queryFn: () => PostgrestQueryBuilder<any, any, any>,
  options: CacheOptions = {}
): Promise<CacheResult<number>> {
  // Les counts peuvent être cachés très longtemps (24h par défaut)
  const { ttl = 86400 } = options;
  
  // Génère la clé de cache
  const cacheKey = options.key 
    ? generateCacheKey(options.key, options)
    : `supabase:count:${Date.now()}`;
  
  // Essaie d'abord Astro.cache (disponible dans les pages .astro)
  if (typeof Astro !== 'undefined' && Astro.cache) {
    try {
      const cached = await Astro.cache.get(cacheKey);
      if (cached !== null && cached !== undefined) {
        console.log(`✅ Cache HIT (Astro.cache): ${cacheKey}`);
        return {
          data: cached as number,
          error: null,
          fromCache: true,
        };
      }
      console.log(`❌ Cache MISS (Astro.cache): ${cacheKey}`);
    } catch (error) {
      console.warn(`Cache get failed for key ${cacheKey}:`, error);
    }
  }
  
  // Si Astro.cache n'est pas disponible, utilise le cache mémoire (pour API routes)
  cleanupMemoryCache();
  const memoryEntry = memoryCache.get(cacheKey);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    console.log(`✅ Cache HIT (memory): ${cacheKey}`);
    return {
      data: memoryEntry.data as number,
      error: null,
      fromCache: true,
    };
  }
  
  if (memoryEntry) {
    console.log(`❌ Cache MISS (memory expired): ${cacheKey}`);
  } else {
    console.log(`❌ Cache MISS (memory): ${cacheKey}`);
  }
  
  // Exécute la requête
  try {
    const query = queryFn();
    const { data, count, error } = await query;
    
    if (error) {
      return {
        data: null,
        error: error as Error,
        fromCache: false,
      };
    }
    
    // Pour les requêtes count avec head: true, Supabase retourne count dans la propriété count
    const countValue = count !== null && count !== undefined ? count : (data as number);
    
    // Stocke dans Astro.cache (si disponible)
    if (typeof Astro !== 'undefined' && Astro.cache && countValue !== null && countValue !== undefined) {
      try {
        await Astro.cache.set(cacheKey, countValue, { ttl });
        console.log(`💾 Cache SET (Astro.cache): ${cacheKey} (TTL: ${ttl}s)`);
      } catch (error) {
        console.warn(`Cache set failed for key ${cacheKey}:`, error);
      }
    }
    
    // Stocke aussi dans le cache mémoire
    if (countValue !== null && countValue !== undefined) {
      const expiresAt = Date.now() + (ttl * 1000);
      memoryCache.set(cacheKey, { data: countValue, expiresAt });
      console.log(`💾 Cache SET (memory): ${cacheKey} (TTL: ${ttl}s)`);
      
      // Limite la taille du cache mémoire
      if (memoryCache.size > 1000) {
        const entries = Array.from(memoryCache.entries())
          .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
          .slice(0, 100);
        for (const [key] of entries) {
          memoryCache.delete(key);
        }
      }
    }
    
    return {
      data: countValue as number,
      error: null,
      fromCache: false,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      fromCache: false,
    };
  }
}

/**
 * Invalide les caches pour un type de contenu spécifique
 * 
 * Utilise un système de versioning : en incrémentant la version,
 * toutes les clés de cache avec l'ancienne version deviennent invalides.
 * 
 * @param contentType Type de contenu à invalider
 * @param lang Langue spécifique (optionnel, invalide toutes les langues si non fourni)
 */
export async function invalidateCache(
  contentType: 'resources' | 'wallpapers' | 'news' | 'features',
  lang?: string
): Promise<void> {
  try {
    const newVersion = await incrementCacheVersion(contentType);
    console.log(`🔄 Cache INVALIDATED: ${contentType} → version ${newVersion}${lang ? ` (lang: ${lang})` : ''}`);
  } catch (error) {
    console.error(`Failed to invalidate cache for ${contentType}:`, error);
  }
}

/**
 * Pré-génère les caches après insertion d'un nouvel élément
 * 
 * Cette fonction exécute les requêtes les plus fréquentes et les met en cache
 * pour éviter les requêtes futures.
 * 
 * @param contentType Type de contenu inséré
 * @param supabaseClient Client Supabase pour exécuter les requêtes
 * @param lang Langue pour les caches multi-langue
 */
export async function pregenerateCache(
  contentType: 'resources' | 'wallpapers' | 'news',
  supabaseClient: any,
  lang?: string
): Promise<void> {
  try {
    switch (contentType) {
      case 'resources':
        // Pré-génère latest resources
        await cachedQuery(
          () => supabaseClient
            .from('resources')
            .select('*')
            .eq('status', 'approved')
            .eq('hidden', false)
            .order('created_at', { ascending: false })
            .limit(6),
          {
            key: await CacheKeys.latestResources(lang),
            ttl: 86400,
            lang,
            contentType: 'resources',
          }
        );
        
        // Pré-génère count
        await cachedCount(
          () => supabaseClient
            .from('resources')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved')
            .eq('hidden', false),
          {
            key: await CacheKeys.resourcesCount(),
            ttl: 86400,
            contentType: 'resources',
          }
        );
        break;
        
      case 'wallpapers':
        // Pré-génère latest wallpapers
        await cachedQuery(
          () => supabaseClient
            .from('wallpapers')
            .select('*')
            .eq('status', 'published')
            .eq('hidden', false)
            .order('created_at', { ascending: false })
            .limit(4),
          {
            key: await CacheKeys.latestWallpapers(lang),
            ttl: 86400,
            lang,
            contentType: 'wallpapers',
          }
        );
        
        // Pré-génère count
        await cachedCount(
          () => supabaseClient
            .from('wallpapers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .eq('hidden', false),
          {
            key: await CacheKeys.wallpapersCount(),
            ttl: 86400,
            contentType: 'wallpapers',
          }
        );
        break;
        
      case 'news':
        // Pré-génère latest news
        await cachedQuery(
          () => supabaseClient
            .from('news')
            .select('*')
            .eq('status', 'published')
            .eq('hidden', false)
            .order('featured', { ascending: false })
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(3),
          {
            key: await CacheKeys.latestNews(lang),
            ttl: 86400,
            lang,
            contentType: 'news',
          }
        );
        
        // Pré-génère count
        await cachedCount(
          () => supabaseClient
            .from('news')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .eq('hidden', false),
          {
            key: await CacheKeys.newsCount(),
            ttl: 86400,
            contentType: 'news',
          }
        );
        break;
    }
    
    console.log(`Cache pre-generated for ${contentType}${lang ? ` (${lang})` : ''}`);
  } catch (error) {
    console.error(`Failed to pre-generate cache for ${contentType}:`, error);
    // Ne pas faire échouer l'insertion si la pré-génération échoue
  }
}

/**
 * Système de versioning pour invalidation efficace
 * 
 * Chaque type de contenu a une version. Quand on invalide,
 * on incrémente la version, ce qui invalide automatiquement tous les caches.
 */
async function getCacheVersion(contentType: 'resources' | 'wallpapers' | 'news' | 'features'): Promise<number> {
  if (typeof Astro === 'undefined' || !Astro.cache) {
    return 1;
  }
  
  try {
    const versionKey = `cache:version:${contentType}`;
    const cached = await Astro.cache.get(versionKey);
    return (cached as number) || 1;
  } catch {
    return 1;
  }
}

async function incrementCacheVersion(contentType: 'resources' | 'wallpapers' | 'news' | 'features'): Promise<number> {
  if (typeof Astro === 'undefined' || !Astro.cache) {
    return 1;
  }
  
  try {
    const versionKey = `cache:version:${contentType}`;
    const currentVersion = await getCacheVersion(contentType);
    const newVersion = currentVersion + 1;
    
    // Stocke la nouvelle version avec TTL très long
    await Astro.cache.set(versionKey, newVersion, { ttl: 86400 * 365 }); // 1 an
    
    return newVersion;
  } catch (error) {
    console.warn(`Failed to increment cache version for ${contentType}:`, error);
    return 1;
  }
}

/**
 * Clés de cache prédéfinies pour les requêtes communes
 * 
 * Les clés incluent maintenant la version pour invalidation automatique
 */
export const CacheKeys = {
  latestResources: async (lang?: string) => {
    const version = await getCacheVersion('resources');
    return `latest:resources:v${version}:${lang || 'all'}`;
  },
  featuredResources: async (lang?: string) => {
    const version = await getCacheVersion('resources');
    return `featured:resources:v${version}:${lang || 'all'}`;
  },
  starredResources: async (lang?: string) => {
    const version = await getCacheVersion('resources');
    return `starred:resources:v${version}:${lang || 'all'}`;
  },
  latestWallpapers: async (lang?: string) => {
    const version = await getCacheVersion('wallpapers');
    return `latest:wallpapers:v${version}:${lang || 'all'}`;
  },
  latestNews: async (lang?: string) => {
    const version = await getCacheVersion('news');
    return `latest:news:v${version}:${lang || 'all'}`;
  },
  wallpapersCount: async (category?: string) => {
    const version = await getCacheVersion('wallpapers');
    return `count:wallpapers:v${version}:${category || 'all'}`;
  },
  newsCount: async () => {
    const version = await getCacheVersion('news');
    return `count:news:v${version}:all`;
  },
  resourcesCount: async (type?: string) => {
    const version = await getCacheVersion('resources');
    return `count:resources:v${version}:${type || 'all'}`;
  },
  wallpapersPage: async (page: number, category?: string, sort?: string) => {
    const version = await getCacheVersion('wallpapers');
    return `wallpapers:page:v${version}:${page}:${category || 'all'}:${sort || 'latest'}`;
  },
  newsPage: async (page: number) => {
    const version = await getCacheVersion('news');
    return `news:page:v${version}:${page}`;
  },
  resourcesPage: async (page: number, type?: string) => {
    const version = await getCacheVersion('resources');
    return `resources:page:v${version}:${page}:${type || 'all'}`;
  },
  newsBySlug: async (slug: string) => {
    const version = await getCacheVersion('news');
    return `news:slug:v${version}:${slug}`;
  },
  wallpaperById: async (id: string) => {
    const version = await getCacheVersion('wallpapers');
    return `wallpaper:id:v${version}:${id}`;
  },
  resourceById: async (id: string) => {
    const version = await getCacheVersion('resources');
    return `resource:id:v${version}:${id}`;
  },
} as const;
