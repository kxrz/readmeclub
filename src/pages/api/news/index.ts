export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const featured = url.searchParams.get('featured') === 'true';
    
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
    
    const { data, error } = await query;
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get total count for pagination
    const { count } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .eq('hidden', false);
    
    return new Response(JSON.stringify({ 
      data: data || [],
      total: count || 0,
      limit,
      offset
    }), {
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

