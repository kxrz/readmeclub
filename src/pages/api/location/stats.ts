import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';

export const GET: APIRoute = async () => {
  try {
    // Get aggregated location data grouped by country_code
    const { data, error } = await supabase
      .from('location_declarations')
      .select('country_code')
      .order('created_at', { ascending: false });
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Aggregate by country_code
    const stats: Record<string, number> = {};
    if (data) {
      for (const declaration of data) {
        const code = declaration.country_code.toUpperCase();
        stats[code] = (stats[code] || 0) + 1;
      }
    }
    
    // Get total count
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    
    return new Response(JSON.stringify({ 
      stats,
      total,
      countries: Object.keys(stats).length 
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

