export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Route API pour tracker les vues d'un article de news
 * Appelée en arrière-plan par JavaScript, ne sert pas le fichier
 */
export const POST: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Vérifier que l'article existe et est publié
    const supabaseAdmin = getSupabaseAdmin();
    const { data: article, error: articleError } = await supabaseAdmin
      .from('news')
      .select('id, status, hidden')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (articleError || !article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Incrémenter le compteur de vues (async, non-blocking)
    try {
      await supabaseAdmin.rpc('increment_news_views', { news_id: article.id });
    } catch (error: any) {
      // Log error but don't fail the request
      console.error('Failed to increment view count:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to track view' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Track view error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
