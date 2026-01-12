import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { loadAllNewsArticles } from '@/lib/utils/news-loader';
import { normalizeSiteUrl } from '@/lib/utils/url';

export const GET: APIRoute = async (context) => {
  const siteUrl = normalizeSiteUrl(context.site);
  
  // Charger tous les articles publiés
  const articles = await loadAllNewsArticles();
  
  // Générer les items RSS
  const items = articles.map((article) => {
    const articleUrl = `${siteUrl}/news/${article.slug}`;
    const pubDate = article.published_at ? new Date(article.published_at) : new Date();
    
    return {
      title: article.title,
      description: article.excerpt || article.title,
      link: articleUrl,
      pubDate: pubDate,
      author: article.author_email || article.author_name || undefined,
      // Inclure l'image featured si présente
      ...(article.featured_image && {
        customData: `
          <enclosure url="${siteUrl}${article.featured_image}" type="image/jpeg"/>
        `,
      }),
    };
  });
  
  return rss({
    title: 'readme.club News',
    description: 'Latest updates and articles from the Xteink community',
    site: siteUrl,
    items: items,
    customData: `
      <language>en</language>
      <managingEditor>${siteUrl}</managingEditor>
      <webMaster>${siteUrl}</webMaster>
    `,
  });
};
