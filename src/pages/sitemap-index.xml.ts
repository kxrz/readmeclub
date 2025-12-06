import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';

const siteUrl = 'https://readme.club';
const locales = ['en', 'fr', 'es', 'ru', 'cn'];

// Pages statiques
const staticPages = [
  '',
  'resources',
  'wallpapers',
  'fonts',
  'tips',
  'board',
  'location',
  'guide',
  'disclaimer',
  'submit',
];

export const GET: APIRoute = async () => {
  const urls: string[] = [];

  // Pages statiques pour chaque langue
  for (const locale of locales) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    
    for (const page of staticPages) {
      urls.push(`${siteUrl}${prefix}${page ? `/${page}` : ''}`);
    }
  }

  // Ressources dynamiques
  try {
    const { data: resources } = await supabase
      .from('resources')
      .select('id')
      .eq('status', 'approved')
      .eq('hidden', false);

    if (resources) {
      for (const locale of locales) {
        const prefix = locale === 'en' ? '' : `/${locale}`;
        for (const resource of resources) {
          urls.push(`${siteUrl}${prefix}/resources/${resource.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching resources for sitemap:', error);
  }

  // Wallpapers dynamiques
  try {
    const { data: wallpapers } = await supabase
      .from('wallpapers')
      .select('id')
      .eq('status', 'published')
      .eq('hidden', false);

    if (wallpapers) {
      for (const locale of locales) {
        const prefix = locale === 'en' ? '' : `/${locale}`;
        for (const wallpaper of wallpapers) {
          urls.push(`${siteUrl}${prefix}/wallpapers/${wallpaper.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching wallpapers for sitemap:', error);
  }

  // Générer le XML du sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

