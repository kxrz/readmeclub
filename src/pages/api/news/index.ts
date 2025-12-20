export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { cachedQuery, cachedCount, CacheKeys } from '@/lib/supabase/cache';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const featured = url.searchParams.get('featured') === 'true';
    const page = Math.floor(offset / limit) + 1;
    
    // Query avec cache
    const { data, error } = await cachedQuery(
      () => {
        let query = supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .eq('hidden', false)
          .order('featured', { ascending: false })
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (featured) {
          query = query.eq('featured', true);
        }
        
        return query;
      },
      {
        key: featured 
          ? `api:news:featured:${await CacheKeys.newsPage(page)}`
          : await CacheKeys.newsPage(page),
        ttl: 86400,
        contentType: 'news',
        parts: [page, limit, featured],
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
        key: await CacheKeys.newsCount(),
        ttl: 86400,
        contentType: 'news',
      }
    );
    
    return new Response(JSON.stringify({ 
      data: data || [],
      total: count || 0,
      limit,
      offset
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

