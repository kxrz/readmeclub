export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { cachedQuery, CacheKeys } from '@/lib/supabase/cache';

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch article avec cache
    const { data: article, error } = await cachedQuery(
      () => supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('hidden', false)
        .single(),
      {
        key: await CacheKeys.newsBySlug(slug),
        ttl: 86400,
        contentType: 'news',
      }
    );
    
    if (error || !article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment views count (ne pas bloquer la réponse)
    const supabaseAdmin = getSupabaseAdmin();
    supabaseAdmin
      .from('news')
      .update({ views_count: article.views_count + 1 })
      .eq('id', article.id)
      .catch(err => console.error('Failed to increment views:', err));
    
    return new Response(JSON.stringify(article), {
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

