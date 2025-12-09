export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const GET: APIRoute = async ({ params }) => {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch article
    const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (error || !article) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment views count
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin
      .from('news')
      .update({ views_count: article.views_count + 1 })
      .eq('id', article.id);
    
    return new Response(JSON.stringify(article), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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

