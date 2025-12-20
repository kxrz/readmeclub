import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { cachedQuery, CacheKeys } from '@/lib/supabase/cache';

/**
 * Endpoint de debug pour vérifier le fonctionnement du cache
 * 
 * Usage: http://localhost:4321/api/debug/cache?type=resources|wallpapers|news
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'resources';
    
    if (!['resources', 'wallpapers', 'news'].includes(type)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid type. Use: resources, wallpapers, or news' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Test 1: Premier appel (devrait être cache MISS)
    const start1 = Date.now();
    const key1 = type === 'resources' 
      ? await CacheKeys.latestResources()
      : type === 'wallpapers'
      ? await CacheKeys.latestWallpapers()
      : await CacheKeys.latestNews();
    
    const { data: data1, fromCache: fromCache1, error: error1 } = await cachedQuery(
      () => {
        if (type === 'resources') {
          return supabase.from('resources').select('*').eq('status', 'approved').eq('hidden', false).limit(3).order('created_at', { ascending: false });
        } else if (type === 'wallpapers') {
          return supabase.from('wallpapers').select('*').eq('status', 'published').eq('hidden', false).limit(3).order('created_at', { ascending: false });
        } else {
          return supabase.from('news').select('*').eq('status', 'published').eq('hidden', false).limit(3).order('published_at', { ascending: false });
        }
      },
      {
        key: key1,
        ttl: 86400,
        contentType: type as 'resources' | 'wallpapers' | 'news',
      }
    );
    const duration1 = Date.now() - start1;

    // Test 2: Deuxième appel immédiatement (devrait être cache HIT)
    const start2 = Date.now();
    const key2 = key1; // Même clé
    const { data: data2, fromCache: fromCache2, error: error2 } = await cachedQuery(
      () => {
        if (type === 'resources') {
          return supabase.from('resources').select('*').eq('status', 'approved').eq('hidden', false).limit(3).order('created_at', { ascending: false });
        } else if (type === 'wallpapers') {
          return supabase.from('wallpapers').select('*').eq('status', 'published').eq('hidden', false).limit(3).order('created_at', { ascending: false });
        } else {
          return supabase.from('news').select('*').eq('status', 'published').eq('hidden', false).limit(3).order('published_at', { ascending: false });
        }
      },
      {
        key: key2,
        ttl: 86400,
        contentType: type as 'resources' | 'wallpapers' | 'news',
      }
    );
    const duration2 = Date.now() - start2;

    // Vérifie si Astro.cache est disponible (pour les pages .astro)
    // Note: Le cache mémoire fonctionne toujours, même si Astro.cache n'est pas disponible
    const astroCacheAvailable = typeof Astro !== 'undefined' && !!Astro.cache;
    const cacheAvailable = true; // Le cache mémoire est toujours disponible

    return new Response(JSON.stringify({
      cache: {
        available: cacheAvailable,
        astroCacheAvailable,
        memoryCacheAvailable: true, // Toujours disponible
        type,
      },
      test1: {
        fromCache: fromCache1,
        duration: `${duration1}ms`,
        hasData: !!data1,
        error: error1?.message || null,
        key: key1,
      },
      test2: {
        fromCache: fromCache2,
        duration: `${duration2}ms`,
        hasData: !!data2,
        error: error2?.message || null,
        key: key2,
      },
      result: {
        cacheWorking: cacheAvailable && fromCache1 === false && fromCache2 === true,
        performanceGain: fromCache2 ? `${Math.round((duration1 - duration2) / duration1 * 100)}% plus rapide` : 'N/A',
      },
    }, null, 2), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      stack: import.meta.env.DEV ? error.stack : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
