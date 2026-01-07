export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Route API pour tracker les téléchargements de wallpapers
 * Appelée en arrière-plan par JavaScript, ne sert pas le fichier
 */
export const POST: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Vérifier que le wallpaper existe et est publié
    const supabaseAdmin = getSupabaseAdmin();
    const { data: wallpaper, error: wallpaperError } = await supabaseAdmin
      .from('wallpapers')
      .select('id, status, hidden')
      .eq('id', id)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (wallpaperError || !wallpaper) {
      return new Response(JSON.stringify({ error: 'Wallpaper not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Incrémenter le compteur de téléchargements (async, non-blocking)
    try {
      await supabaseAdmin.rpc('increment_wallpaper_downloads', { wallpaper_id: id });
    } catch (error: any) {
      // Log error but don't fail the request
      console.error('Failed to increment download count:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Failed to track download' 
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
    console.error('Track download error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
