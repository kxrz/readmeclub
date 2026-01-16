export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { generateWeeklyDigestMarkdown, generateWeeklyDigestExcerpt, generateSlug, getWeekNumber } from '@/lib/utils/weekly-digest-generator';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAdmin(cookies);
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Charger la config
    const { data: config, error: configError } = await supabaseAdmin
      .from('weekly_digest_config')
      .select('*')
      .limit(1)
      .single();
    
    if (configError || !config) {
      return new Response(JSON.stringify({ error: 'Configuration not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Calculer la période
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (config.period_days || 7));
    
    // Formater les dates
    const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const weekNumber = getWeekNumber(endDate);
    
    // Récupérer les données
    const { data: resources } = await supabaseAdmin
      .from('resources')
      .select('id, title, description, type, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'approved')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    const { data: news } = await supabaseAdmin
      .from('news')
      .select('id, title, slug, excerpt, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'published')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    const { data: wallpapers } = await supabaseAdmin
      .from('wallpapers')
      .select('id, title, download_count, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'published')
      .eq('hidden', false)
      .order('download_count', { ascending: false });
    
    // Pré-vérifier les images du top 3
    const top3Wallpapers = wallpapers?.slice(0, 3) || [];
    const resolvedImageUrls: Record<string, string> = {};
    for (const w of top3Wallpapers) {
      const thumbnailUrl = `https://readme.club/wallpapers/${w.id}/thumbnail.webp`;
      const fallbackUrl = `https://readme.club/wallpapers/${w.id}/image.jpg`;
      try {
        const res = await fetch(thumbnailUrl, { method: 'HEAD' });
        resolvedImageUrls[w.id] = res.ok ? thumbnailUrl : fallbackUrl;
      } catch {
        resolvedImageUrls[w.id] = fallbackUrl;
      }
    }
    
    // Récupérer une ressource aléatoire (hors de celles déjà dans le digest)
    const digestResourceIds = resources?.map((r: any) => r.id) || [];
    let randomRes = null;
    if (digestResourceIds.length > 0) {
      const { data: randomData } = await supabaseAdmin
        .from('resources')
        .select('id, title, description')
        .eq('status', 'approved')
        .eq('hidden', false)
        .not('id', 'in', `(${digestResourceIds.join(',')})`)
        .limit(100);
      
      if (randomData && randomData.length > 0) {
        randomRes = randomData[Math.floor(Math.random() * randomData.length)];
      }
    }
    
    // Générer l'intro (fallback simple pour l'instant)
    const total = (resources?.length || 0) + (news?.length || 0) + (wallpapers?.length || 0);
    const introHtml = `Hey there, e-reader enthusiasts!<br><br>We're back with another exciting edition packed with fresh resources and a splash of news just for you.<br><br>Don't miss out on our top wallpaper this week, "${wallpapers?.[0]?.title || 'Untitled'}", which has been a hit with ${wallpapers?.[0]?.download_count || 0} downloads!<br><br>👋 ${config.author_name || 'Florent'}`;
    const intro = introHtml.replace(/<br>/g, '\n');
    
    // Générer le contenu Markdown
    const digestData = {
      period: {
        start: startDate,
        end: endDate,
        startFormatted,
        endFormatted,
        weekNumber
      },
      stats: {
        resources: resources?.length || 0,
        news: news?.length || 0,
        wallpapers: wallpapers?.length || 0
      },
      resources: resources || [],
      news: news || [],
      wallpapers: wallpapers || []
    };
    
    const content = generateWeeklyDigestMarkdown(digestData, intro, randomRes, resolvedImageUrls);
    
    // Générer le slug
    const slug = generateSlug(config.slug_pattern || 'weekly-digest-week-{weekNumber}-{date}', weekNumber, endDate);
    
    // Vérifier si un article avec ce slug existe déjà
    const { data: existing } = await supabaseAdmin
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existing) {
      return new Response(JSON.stringify({ error: `Article with slug "${slug}" already exists` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Créer l'article
    const title = `📬 Weekly Digest - Week ${weekNumber}`;
    const excerpt = generateWeeklyDigestExcerpt(
      { startFormatted, endFormatted },
      digestData.stats
    );
    
    const { data: article, error: articleError } = await supabaseAdmin
      .from('news')
      .insert({
        title,
        slug,
        excerpt,
        content,
        author_name: config.author_name || 'iamkxrz',
        status: 'draft',
        published_at: endDate.toISOString(),
        ready_for_static: false
      })
      .select()
      .single();
    
    if (articleError) {
      return new Response(JSON.stringify({ error: articleError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Enregistrer dans l'historique
    await supabaseAdmin
      .from('weekly_digest_history')
      .insert({
        article_id: article.id,
        period_start: startDate.toISOString().split('T')[0],
        period_end: endDate.toISOString().split('T')[0],
        stats_resources: digestData.stats.resources,
        stats_news: digestData.stats.news,
        stats_wallpapers: digestData.stats.wallpapers
      });
    
    // Mettre à jour last_generated_at
    await supabaseAdmin
      .from('weekly_digest_config')
      .update({ last_generated_at: new Date().toISOString() })
      .eq('id', config.id);
    
    return new Response(JSON.stringify({
      success: true,
      article_id: article.id,
      article_slug: article.slug,
      period: {
        start: startFormatted,
        end: endFormatted
      },
      stats: digestData.stats
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
