import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { loadAllResources } from '@/lib/utils/resource-loader';
import { normalizeSiteUrl } from '@/lib/utils/url';

export const GET: APIRoute = async (context) => {
  const siteUrl = normalizeSiteUrl(context.site);
  
  // Charger toutes les ressources publiées
  const resources = await loadAllResources();
  
  // Générer les items RSS
  const items = resources.map((resource) => {
    const resourceUrl = `${siteUrl}/resources/${resource.id}`;
    const pubDate = resource.created_at ? new Date(resource.created_at) : new Date();
    
    // Construire le customData pour l'enclosure si image présente
    let customData = '';
    if (resource.thumbnail_url) {
      // Déterminer le type MIME basé sur l'URL
      const imageUrl = resource.thumbnail_url.startsWith('http') 
        ? resource.thumbnail_url 
        : `${siteUrl}${resource.thumbnail_url.startsWith('/') ? resource.thumbnail_url : `/${resource.thumbnail_url}`}`;
      const extension = imageUrl.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      else if (extension === 'gif') mimeType = 'image/gif';
      else if (extension === 'webp') mimeType = 'image/webp';
      
      customData = `<enclosure url="${imageUrl}" type="${mimeType}" />`;
    }
    
    return {
      title: resource.title,
      description: resource.description || resource.title,
      link: resourceUrl,
      pubDate: pubDate,
      ...(resource.contributor_name && { author: resource.contributor_name }),
      ...(customData && { customData }),
    };
  });
  
  const rssResponse = await rss({
    title: 'readme.club Resources',
    description: 'Latest community resources, tools, fonts, and more for Xteink devices',
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
