import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .eq('hidden', false)
      .single();
    
    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Resource not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data), {
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

