export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/utils/admin';

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    requireAdmin(cookies);

    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Soft delete (set hidden = true)
    const { error } = await supabaseAdmin
      .from('news')
      .update({ hidden: true })
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
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

