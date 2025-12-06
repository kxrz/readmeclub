import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_OLD_SUPABASE_URL || process.env.OLD_PUBLIC_SUPABASE_URL;
const OLD_SUPABASE_ANON_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY;
const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const NEW_SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_ANON_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_OLD_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateStats() {
  console.log('📊 Migration des statistiques de téléchargement...\n');

  try {
    // 1. Migrer les statistiques des ressources
    console.log('📦 Migration des statistiques des ressources...');
    const { data: oldResources, error: resourcesError } = await oldSupabase
      .from('resources')
      .select('id, title, downloads_count, file_url, external_link');

    if (resourcesError) {
      console.error('❌ Erreur lors de la récupération des ressources:', resourcesError);
    } else if (oldResources && oldResources.length > 0) {
      let migrated = 0;
      let skipped = 0;
      let totalDownloadsMigrated = 0;

      for (const oldResource of oldResources) {
        if (!oldResource.downloads_count || oldResource.downloads_count === 0) {
          skipped++;
          continue;
        }

        // Chercher la ressource correspondante dans la nouvelle base
        // Par titre + file_url ou external_link
        let query = newSupabase
          .from('resources')
          .select('id, downloads_count')
          .eq('title', oldResource.title);

        if (oldResource.file_url) {
          query = query.eq('file_url', oldResource.file_url);
        } else if (oldResource.external_link) {
          query = query.eq('external_link', oldResource.external_link);
        }

        const { data: matchingResources } = await query;

        if (matchingResources && matchingResources.length > 0) {
          // Mettre à jour avec le maximum entre l'ancien et le nouveau compteur
          const existingCount = matchingResources[0].downloads_count || 0;
          const newCount = Math.max(existingCount, oldResource.downloads_count);

          if (newCount > existingCount) {
            const { error: updateError } = await newSupabase
              .from('resources')
              .update({ downloads_count: newCount })
              .eq('id', matchingResources[0].id);

            if (updateError) {
              console.error(`   ⚠️  Erreur mise à jour ${oldResource.title}:`, updateError.message);
            } else {
              migrated++;
              totalDownloadsMigrated += (newCount - existingCount);
            }
          } else {
            skipped++;
          }
        } else {
          skipped++;
        }
      }

      console.log(`   ✅ ${migrated} ressources mises à jour`);
      console.log(`   ⏭️  ${skipped} ressources ignorées (pas de correspondance ou déjà à jour)`);
      console.log(`   📊 ${totalDownloadsMigrated} téléchargements migrés`);
    }

    // 2. Migrer les statistiques des wallpapers
    console.log('\n🖼️  Migration des statistiques des wallpapers...');
    const { data: oldWallpapers, error: wallpapersError } = await oldSupabase
      .from('wallpapers')
      .select('id, title, download_count, file_url');

    if (wallpapersError) {
      console.error('❌ Erreur lors de la récupération des wallpapers:', wallpapersError);
    } else if (oldWallpapers && oldWallpapers.length > 0) {
      let migrated = 0;
      let skipped = 0;
      let totalDownloadsMigrated = 0;

      for (const oldWallpaper of oldWallpapers) {
        if (!oldWallpaper.download_count || oldWallpaper.download_count === 0) {
          skipped++;
          continue;
        }

        // Chercher le wallpaper correspondant par file_url
        const { data: matchingWallpapers } = await newSupabase
          .from('wallpapers')
          .select('id, download_count')
          .eq('file_url', oldWallpaper.file_url)
          .limit(1);

        if (matchingWallpapers && matchingWallpapers.length > 0) {
          const existingCount = matchingWallpapers[0].download_count || 0;
          const newCount = Math.max(existingCount, oldWallpaper.download_count);

          if (newCount > existingCount) {
            const { error: updateError } = await newSupabase
              .from('wallpapers')
              .update({ download_count: newCount })
              .eq('id', matchingWallpapers[0].id);

            if (updateError) {
              console.error(`   ⚠️  Erreur mise à jour ${oldWallpaper.title || 'Sans titre'}:`, updateError.message);
            } else {
              migrated++;
              totalDownloadsMigrated += (newCount - existingCount);
            }
          } else {
            skipped++;
          }
        } else {
          skipped++;
        }
      }

      console.log(`   ✅ ${migrated} wallpapers mis à jour`);
      console.log(`   ⏭️  ${skipped} wallpapers ignorés (pas de correspondance ou déjà à jour)`);
      console.log(`   📊 ${totalDownloadsMigrated} téléchargements migrés`);
    }

    // 3. Migrer les analytics
    console.log('\n📈 Migration des analytics...');
    const { data: oldAnalytics, error: analyticsError } = await oldSupabase
      .from('analytics')
      .select('*')
      .single();

    if (analyticsError) {
      console.error('❌ Erreur lors de la récupération des analytics:', analyticsError);
    } else if (oldAnalytics) {
      // Récupérer les analytics actuels de la nouvelle base
      const { data: newAnalytics } = await newSupabase
        .from('analytics')
        .select('*')
        .single();

      if (newAnalytics) {
        const updates: any = {};

        // Mettre à jour avec le maximum entre l'ancien et le nouveau
        if (oldAnalytics.pdf_v2_downloads) {
          updates.pdf_v2_downloads = Math.max(
            newAnalytics.pdf_v2_downloads || 0,
            oldAnalytics.pdf_v2_downloads || 0
          );
        }
        if (oldAnalytics.epub_v2_downloads) {
          updates.epub_v2_downloads = Math.max(
            newAnalytics.epub_v2_downloads || 0,
            oldAnalytics.epub_v2_downloads || 0
          );
        }
        if (oldAnalytics.pdf_downloads) {
          updates.pdf_downloads = Math.max(
            newAnalytics.pdf_downloads || 0,
            oldAnalytics.pdf_downloads || 0
          );
        }
        if (oldAnalytics.csv_downloads) {
          updates.csv_downloads = Math.max(
            newAnalytics.csv_downloads || 0,
            oldAnalytics.csv_downloads || 0
          );
        }
        if (oldAnalytics.page_views) {
          updates.page_views = Math.max(
            newAnalytics.page_views || 0,
            oldAnalytics.page_views || 0
          );
        }

        const { error: updateError } = await newSupabase
          .from('analytics')
          .update(updates)
          .eq('id', newAnalytics.id);

        if (updateError) {
          console.error('❌ Erreur lors de la mise à jour des analytics:', updateError);
        } else {
          console.log('   ✅ Analytics mis à jour');
          console.log(`   📊 PDF v2: ${updates.pdf_v2_downloads || newAnalytics.pdf_v2_downloads || 0}`);
          console.log(`   📊 EPUB v2: ${updates.epub_v2_downloads || newAnalytics.epub_v2_downloads || 0}`);
        }
      }
    }

    console.log('\n✅ Migration terminée');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

migrateStats();

