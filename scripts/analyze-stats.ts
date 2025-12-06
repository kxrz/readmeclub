import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_OLD_SUPABASE_URL || process.env.OLD_PUBLIC_SUPABASE_URL;
const OLD_SUPABASE_ANON_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_ANON_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_OLD_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);

async function analyzeStats() {
  console.log('📊 Analyse des statistiques de téléchargement de l\'ancienne base...\n');

  try {
    // Analyser les ressources
    const { data: resources, error: resourcesError } = await oldSupabase
      .from('resources')
      .select('id, title, downloads_count, file_url, external_link')
      .order('downloads_count', { ascending: false })
      .limit(100);

    if (resourcesError) {
      console.error('❌ Erreur lors de la récupération des ressources:', resourcesError);
    } else {
      console.log(`📦 Ressources trouvées: ${resources?.length || 0}`);
      const totalResourceDownloads = resources?.reduce((sum, r) => sum + (r.downloads_count || 0), 0) || 0;
      console.log(`   Total téléchargements ressources: ${totalResourceDownloads}`);
      
      if (resources && resources.length > 0) {
        console.log('\n   Top 10 ressources par téléchargements:');
        resources.slice(0, 10).forEach((r, i) => {
          console.log(`   ${i + 1}. ${r.title} - ${r.downloads_count || 0} téléchargements`);
        });
      }
    }

    // Analyser les wallpapers
    const { data: wallpapers, error: wallpapersError } = await oldSupabase
      .from('wallpapers')
      .select('id, title, download_count, file_url')
      .order('download_count', { ascending: false })
      .limit(100);

    if (wallpapersError) {
      console.error('❌ Erreur lors de la récupération des wallpapers:', wallpapersError);
    } else {
      console.log(`\n🖼️  Wallpapers trouvés: ${wallpapers?.length || 0}`);
      const totalWallpaperDownloads = wallpapers?.reduce((sum, w) => sum + (w.download_count || 0), 0) || 0;
      console.log(`   Total téléchargements wallpapers: ${totalWallpaperDownloads}`);
      
      if (wallpapers && wallpapers.length > 0) {
        console.log('\n   Top 10 wallpapers par téléchargements:');
        wallpapers.slice(0, 10).forEach((w, i) => {
          console.log(`   ${i + 1}. ${w.title || 'Sans titre'} - ${w.download_count || 0} téléchargements`);
        });
      }
    }

    // Analyser les analytics
    const { data: analytics, error: analyticsError } = await oldSupabase
      .from('analytics')
      .select('*')
      .single();

    if (analyticsError) {
      console.error('❌ Erreur lors de la récupération des analytics:', analyticsError);
    } else {
      console.log(`\n📈 Analytics:`);
      if (analytics) {
        console.log(`   PDF v2 downloads: ${analytics.pdf_v2_downloads || 0}`);
        console.log(`   EPUB v2 downloads: ${analytics.epub_v2_downloads || 0}`);
        console.log(`   PDF downloads: ${analytics.pdf_downloads || 0}`);
        console.log(`   CSV downloads: ${analytics.csv_downloads || 0}`);
        console.log(`   Page views: ${analytics.page_views || 0}`);
      } else {
        console.log('   Aucune donnée analytics trouvée');
      }
    }

    // Résumé
    console.log('\n📊 Résumé des statistiques:');
    const totalResourceDownloads = resources?.reduce((sum, r) => sum + (r.downloads_count || 0), 0) || 0;
    const totalWallpaperDownloads = wallpapers?.reduce((sum, w) => sum + (w.download_count || 0), 0) || 0;
    const totalGuideDownloads = (analytics?.pdf_v2_downloads || 0) + (analytics?.epub_v2_downloads || 0);
    const totalDownloads = totalResourceDownloads + totalWallpaperDownloads + totalGuideDownloads;
    
    console.log(`   Total téléchargements: ${totalDownloads}`);
    console.log(`   - Ressources: ${totalResourceDownloads}`);
    console.log(`   - Wallpapers: ${totalWallpaperDownloads}`);
    console.log(`   - Guides: ${totalGuideDownloads}`);

    console.log('\n✅ Analyse terminée');
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
    process.exit(1);
  }
}

analyzeStats();

