import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_SUPABASE_URL;
const OLD_SUPABASE_ANON_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY;

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_ANON_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY dans .env');
  process.exit(1);
}

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_ANON_KEY);

async function analyzeFeatures() {
  console.log('🔍 Analyse des feature requests de l\'ancienne base...\n');

  try {
    // Fetch feature requests
    const { data: features, error } = await oldSupabase
      .from('feature_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la récupération:', error);
      return;
    }

    if (!features || features.length === 0) {
      console.log('ℹ️  Aucune feature request trouvée dans l\'ancienne base.');
      return;
    }

    console.log(`✅ ${features.length} feature request(s) trouvée(s)\n`);

    // Statistics
    const stats = {
      total: features.length,
      byStatus: {} as Record<string, number>,
      byAdminStatus: {} as Record<string, number>,
      withVotes: 0,
      withTags: 0,
      withRedditUsername: 0,
      totalVotes: 0,
    };

    features.forEach((feature) => {
      // Count by status
      const status = feature.status || 'unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by admin_status
      const adminStatus = feature.admin_status || 'unknown';
      stats.byAdminStatus[adminStatus] = (stats.byAdminStatus[adminStatus] || 0) + 1;

      // Count features with votes
      if (feature.votes_count > 0) {
        stats.withVotes++;
        stats.totalVotes += feature.votes_count;
      }

      // Count features with tags
      if (feature.tags && Array.isArray(feature.tags) && feature.tags.length > 0) {
        stats.withTags++;
      }

      // Count features with reddit username
      if (feature.reddit_username) {
        stats.withRedditUsername++;
      }
    });

    console.log('📊 Statistiques:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Avec votes: ${stats.withVotes} (${stats.totalVotes} votes au total)`);
    console.log(`   Avec tags: ${stats.withTags}`);
    console.log(`   Avec Reddit username: ${stats.withRedditUsername}`);
    console.log('\n📈 Par statut:');
    Object.entries(stats.byStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    console.log('\n📈 Par admin_status:');
    Object.entries(stats.byAdminStatus).forEach(([adminStatus, count]) => {
      console.log(`   ${adminStatus}: ${count}`);
    });

    // Check for votes
    console.log('\n🔍 Vérification des votes...');
    const { data: votes, error: votesError } = await oldSupabase
      .from('feature_votes')
      .select('*');

    if (votesError) {
      console.log('⚠️  Impossible de récupérer les votes:', votesError.message);
    } else {
      console.log(`✅ ${votes?.length || 0} vote(s) trouvé(s)`);
      if (votes && votes.length > 0) {
        const votesByFeature = {} as Record<string, number>;
        votes.forEach((vote) => {
          const featureId = vote.feature_request_id;
          votesByFeature[featureId] = (votesByFeature[featureId] || 0) + 1;
        });
        console.log(`   Votes répartis sur ${Object.keys(votesByFeature).length} feature request(s)`);
      }
    }

    // Sample data
    console.log('\n📝 Exemple de données (3 premières):');
    features.slice(0, 3).forEach((feature, index) => {
      console.log(`\n${index + 1}. ${feature.title}`);
      console.log(`   ID: ${feature.id}`);
      console.log(`   Description: ${feature.description?.substring(0, 60)}...`);
      console.log(`   Status: ${feature.status}`);
      console.log(`   Admin Status: ${feature.admin_status}`);
      console.log(`   Votes: ${feature.votes_count}`);
      console.log(`   Tags: ${feature.tags?.join(', ') || 'Aucun'}`);
      console.log(`   Reddit: ${feature.reddit_username || 'Aucun'}`);
      console.log(`   Created: ${feature.created_at}`);
      console.log(`   Hidden: ${feature.hidden}`);
    });

    console.log('\n✅ Analyse terminée!');
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
  }
}

analyzeFeatures();

