import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_SUPABASE_URL;
const OLD_SUPABASE_ANON_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY;
const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const NEW_SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY;
const NEW_SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_ANON_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_OLD_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY dans .env');
  process.exit(1);
}

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function migrateFeatures() {
  console.log('🚀 Migration des feature requests...\n');

  try {
    // Fetch all feature requests from old database
    const { data: oldFeatures, error: fetchError } = await oldSupabase
      .from('feature_requests')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Erreur lors de la récupération:', fetchError);
      return;
    }

    if (!oldFeatures || oldFeatures.length === 0) {
      console.log('ℹ️  Aucune feature request à migrer.');
      return;
    }

    console.log(`📦 ${oldFeatures.length} feature request(s) à migrer\n`);

    // Fetch existing features from new database to avoid duplicates
    const { data: existingFeatures } = await newSupabase
      .from('feature_requests')
      .select('id, title, created_at');

    const existingTitles = new Set(
      existingFeatures?.map((f) => f.title.toLowerCase().trim()) || []
    );

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // Migrate features one by one
    for (const oldFeature of oldFeatures) {
      const normalizedTitle = oldFeature.title?.toLowerCase().trim();
      
      if (existingTitles.has(normalizedTitle)) {
        console.log(`⏭️  Déjà existant: "${oldFeature.title}"`);
        skipped++;
        continue;
      }

      try {
        // Prepare data for new database
        const newFeature = {
          title: oldFeature.title,
          description: oldFeature.description,
          reddit_username: oldFeature.reddit_username || null,
          tags: oldFeature.tags || [],
          votes_count: oldFeature.votes_count || 0,
          warnings_count: oldFeature.warnings_count || 0,
          status: 'published' as const,
          hidden: false,
          admin_status: oldFeature.admin_status || 'pending',
          created_at: oldFeature.created_at,
          updated_at: oldFeature.updated_at || oldFeature.created_at,
        };

        // Insert feature request
        const { data: insertedFeature, error: insertError } = await newSupabase
          .from('feature_requests')
          .insert(newFeature)
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Erreur migration "${oldFeature.title}":`, insertError.message);
          errors++;
          continue;
        }

        console.log(`✅ Migré: "${oldFeature.title}" (${oldFeature.votes_count || 0} votes)`);
        migrated++;

        // Migrate votes if feature has votes
        if (oldFeature.votes_count > 0 && insertedFeature) {
          await migrateVotes(oldFeature.id, insertedFeature.id);
        }
      } catch (error: any) {
        console.error(`❌ Erreur migration "${oldFeature.title}":`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`   ✅ Migrés: ${migrated}`);
    console.log(`   ⏭️  Ignorés (déjà existants): ${skipped}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log('\n✅ Migration terminée!');
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
  }
}

async function migrateVotes(oldFeatureId: string, newFeatureId: string) {
  try {
    // Fetch votes for this feature from old database
    const { data: oldVotes, error: fetchError } = await oldSupabase
      .from('feature_votes')
      .select('*')
      .eq('feature_request_id', oldFeatureId);

    if (fetchError || !oldVotes || oldVotes.length === 0) {
      return;
    }

    // Check existing votes in new database
    const { data: existingVotes } = await newSupabase
      .from('feature_votes')
      .select('ip_hash')
      .eq('feature_request_id', newFeatureId);

    const existingIpHashes = new Set(existingVotes?.map((v) => v.ip_hash) || []);

    // Insert votes that don't exist yet
    const votesToInsert = oldVotes
      .filter((vote) => !existingIpHashes.has(vote.ip_hash))
      .map((vote) => ({
        feature_request_id: newFeatureId,
        ip_hash: vote.ip_hash,
        created_at: vote.created_at,
      }));

    if (votesToInsert.length > 0) {
      const { error: insertError } = await newSupabase
        .from('feature_votes')
        .insert(votesToInsert);

      if (insertError) {
        console.log(`   ⚠️  Erreur migration votes: ${insertError.message}`);
      } else {
        console.log(`   ✅ ${votesToInsert.length} vote(s) migré(s)`);
      }
    }
  } catch (error: any) {
    console.log(`   ⚠️  Erreur migration votes: ${error.message}`);
  }
}

migrateFeatures();

