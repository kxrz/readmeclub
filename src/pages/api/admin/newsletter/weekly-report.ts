import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Route API pour générer le rapport hebdomadaire des nouveautés
 * Retourne les ressources, news et wallpapers créés dans les 7 derniers jours
 */
export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    requireAdmin(cookies);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(request.url);
    const daysParam = url.searchParams.get('days');
    const days = daysParam ? parseInt(daysParam) : 7;
    
    // Calculer les dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Récupérer les ressources de la semaine
    const { data: resources, error: resourcesError } = await supabaseAdmin
      .from('resources')
      .select('id, title, description, type, created_at, external_link')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('status', 'approved')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError);
    }
    
    // Récupérer les news de la semaine
    const { data: news, error: newsError } = await supabaseAdmin
      .from('news')
      .select('id, title, excerpt, slug, published_at, created_at')
      .gte('published_at', startDate.toISOString())
      .lte('published_at', endDate.toISOString())
      .eq('status', 'published')
      .eq('hidden', false)
      .order('published_at', { ascending: false });
    
    if (newsError) {
      console.error('Error fetching news:', newsError);
    }
    
    // Récupérer les wallpapers de la semaine
    const { data: wallpapers, error: wallpapersError } = await supabaseAdmin
      .from('wallpapers')
      .select('id, title, category, author_name, reddit_username, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('status', 'published')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    if (wallpapersError) {
      console.error('Error fetching wallpapers:', wallpapersError);
    }
    
    // Formater les dates pour l'affichage
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };
    
    const startDateFormatted = formatDate(startDate.toISOString());
    const endDateFormatted = formatDate(endDate.toISOString());
    
    // Calculer le numéro de semaine
    const weekNumber = getWeekNumber(endDate);
    
    return new Response(
      JSON.stringify({
        success: true,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          startFormatted: startDateFormatted,
          endFormatted: endDateFormatted,
          weekNumber,
          days,
        },
        stats: {
          resources: resources?.length || 0,
          news: news?.length || 0,
          wallpapers: wallpapers?.length || 0,
        },
        resources: resources || [],
        news: news || [],
        wallpapers: wallpapers || [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Weekly report error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * Calcule le numéro de semaine ISO
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
