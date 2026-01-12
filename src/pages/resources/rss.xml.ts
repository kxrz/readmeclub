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
    
    return {
      title: resource.title,
      description: resource.description || resource.title,
      link: resourceUrl,
      pubDate: pubDate,
      author: resource.contributor_name || undefined,
      // Inclure l'image thumbnail si présente
      ...(resource.thumbnail_url && {
        customData: `
          <enclosure url="${resource.thumbnail_url}" type="image/jpeg"/>
        `,
      }),
    };
  });
  
  return rss({
    title: 'readme.club Resources',
    description: 'Latest community resources, tools, fonts, and more for Xteink devices',
    site: siteUrl,
    items: items,
    customData: `
      <language>en</language>
      <managingEditor>${siteUrl}</managingEditor>
      <webMaster>${siteUrl}</webMaster>
    `,
  });
};
