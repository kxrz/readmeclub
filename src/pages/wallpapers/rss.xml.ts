import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { loadAllWallpapers } from '@/lib/utils/wallpaper-loader';
import { normalizeSiteUrl } from '@/lib/utils/url';

export const GET: APIRoute = async (context) => {
  const siteUrl = normalizeSiteUrl(context.site);
  
  // Charger tous les wallpapers publiés
  const wallpapers = await loadAllWallpapers();
  
  // Générer les items RSS
  const items = wallpapers.map((wallpaper) => {
    const wallpaperUrl = `${siteUrl}/wallpapers/${wallpaper.id}`;
    const pubDate = wallpaper.created_at ? new Date(wallpaper.created_at) : new Date();
    
    // Construire le customData pour l'enclosure si image présente
    let customData = '';
    if (wallpaper.file_url) {
      // Déterminer le type MIME basé sur l'URL
      const imageUrl = wallpaper.file_url.startsWith('http') 
        ? wallpaper.file_url 
        : `${siteUrl}${wallpaper.file_url.startsWith('/') ? wallpaper.file_url : `/${wallpaper.file_url}`}`;
      const extension = imageUrl.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      else if (extension === 'gif') mimeType = 'image/gif';
      else if (extension === 'webp') mimeType = 'image/webp';
      
      customData = `<enclosure url="${imageUrl}" type="${mimeType}" />`;
    }
    
    return {
      title: wallpaper.title || `Wallpaper ${wallpaper.id}`,
      description: wallpaper.title 
        ? `New wallpaper: ${wallpaper.title}${wallpaper.author_name ? ` by ${wallpaper.author_name}` : ''}`
        : `New wallpaper added to the collection`,
      link: wallpaperUrl,
      pubDate: pubDate,
      ...(wallpaper.author_name && { author: wallpaper.author_name }),
      ...(customData && { customData }),
    };
  });
  
  const rssResponse = await rss({
    title: 'readme.club Wallpapers',
    description: 'Latest wallpapers added to the Xteink community collection',
    site: siteUrl,
    items: items,
    customData: `<language>en</language>`,
  });
  
  // S'assurer que le Content-Type est correct pour que le navigateur propose l'abonnement
  return new Response(rssResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
