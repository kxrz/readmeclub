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
    
    // Formater l'auteur selon RFC 822 (email format)
    let author: string | undefined;
    if (article.author_email) {
      author = `${article.author_name || 'readme.club'} <${article.author_email}>`;
    } else if (article.author_name) {
      author = article.author_name;
    }
    
    // Construire le customData pour l'enclosure si image présente
    let customData = '';
    if (article.featured_image) {
      // Déterminer le type MIME basé sur l'extension
      const imageUrl = article.featured_image.startsWith('http') 
        ? article.featured_image 
        : `${siteUrl}${article.featured_image.startsWith('/') ? article.featured_image : `/${article.featured_image}`}`;
      const extension = imageUrl.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      else if (extension === 'gif') mimeType = 'image/gif';
      else if (extension === 'webp') mimeType = 'image/webp';
      
      customData = `<enclosure url="${imageUrl}" type="${mimeType}" />`;
    }
    
    return {
      title: article.title,
      description: article.excerpt || article.title,
      link: articleUrl,
      pubDate: pubDate,
      ...(author && { author }),
      ...(customData && { customData }),
    };
  });
  
  const rssResponse = await rss({
    title: 'readme.club News',
    description: 'Latest updates and articles from the Xteink community',
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
