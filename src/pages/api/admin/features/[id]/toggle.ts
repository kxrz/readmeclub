export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  try {
    requireAdmin(cookies);
    
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    const { hidden } = body;
    
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('feature_requests')
      .update({ hidden: !!hidden })
      .eq('id', id);
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

