import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Récupérer tous les wallpapers publiés
    const { data: wallpapers, error } = await supabase
      .from('wallpapers')
      .select('id')
      .eq('status', 'published')
      .eq('hidden', false);
    
    if (error || !wallpapers || wallpapers.length === 0) {
      return new Response(JSON.stringify({ error: 'No wallpapers found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Sélectionner un wallpaper aléatoire
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    const randomWallpaper = wallpapers[randomIndex];
    
    // Déterminer la langue depuis le referer ou l'URL de la requête
    const referer = request.headers.get('referer') || '';
    const url = new URL(request.url);
    
    // Extraire le préfixe de langue depuis le referer ou l'URL
    let langPrefix = '';
    const refererMatch = referer.match(/\/(fr|es|ru|cn)\//);
    const urlMatch = url.pathname.match(/\/(fr|es|ru|cn)\//);
    
    if (refererMatch) {
      langPrefix = `/${refererMatch[1]}`;
    } else if (urlMatch) {
      langPrefix = `/${urlMatch[1]}`;
    }
    
    // Rediriger vers la page de détail du wallpaper
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${langPrefix}/wallpapers/${randomWallpaper.id}`,
      },
    });
  } catch (error) {
    console.error('Error getting random wallpaper:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

