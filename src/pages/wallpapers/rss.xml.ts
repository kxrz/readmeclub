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
    
    return {
      title: wallpaper.title || `Wallpaper ${wallpaper.id}`,
      description: wallpaper.title 
        ? `New wallpaper: ${wallpaper.title}${wallpaper.author_name ? ` by ${wallpaper.author_name}` : ''}`
        : `New wallpaper added to the collection`,
      link: wallpaperUrl,
      pubDate: pubDate,
      author: wallpaper.author_name || undefined,
      // Inclure l'image du wallpaper
      ...(wallpaper.file_url && {
        customData: `
          <enclosure url="${wallpaper.file_url}" type="image/jpeg"/>
        `,
      }),
    };
  });
  
  return rss({
    title: 'readme.club Wallpapers',
    description: 'Latest wallpapers added to the Xteink community collection',
    site: siteUrl,
    items: items,
    customData: `
      <language>en</language>
      <managingEditor>${siteUrl}</managingEditor>
      <webMaster>${siteUrl}</webMaster>
    `,
  });
};
