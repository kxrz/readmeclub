/**
 * Script pour analyser et migrer les déclarations de localisation depuis l'ancien Supabase
 * 
 * Usage: npm run analyze-locations
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_SUPABASE_URL || '';
const OLD_SUPABASE_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY || '';
const OLD_SUPABASE_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || '';

const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY dans .env');
  process.exit(1);
}

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const oldClient = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY || OLD_SUPABASE_KEY);
const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function analyzeLocations() {
  console.log('🔍 Analyse des déclarations de localisation dans l\'ancienne base...\n');

  try {
    // Vérifier si la table existe dans l'ancienne base
    const { data: oldLocations, error: oldError } = await oldClient
      .from('location_declarations')
      .select('*')
      .order('created_at', { ascending: true });

    if (oldError) {
      console.log(`⚠️  Table 'location_declarations' non trouvée dans l'ancienne base: ${oldError.message}`);
      console.log('ℹ️  Aucune donnée de localisation à migrer.\n');
      return;
    }

    if (!oldLocations || oldLocations.length === 0) {
      console.log('ℹ️  Aucune déclaration de localisation trouvée dans l\'ancienne base.\n');
      return;
    }

    console.log(`📦 ${oldLocations.length} déclaration(s) de localisation trouvée(s)\n`);

    // Analyser les données
    const stats: Record<string, number> = {};
    for (const location of oldLocations) {
      const code = (location.country_code || '').toUpperCase();
      if (code && code.length === 2) {
        stats[code] = (stats[code] || 0) + 1;
      }
    }

    console.log('📊 Répartition par pays:');
    const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    for (const [code, count] of sortedStats) {
      console.log(`   ${code}: ${count} déclaration(s)`);
    }
    console.log(`\n📈 Total: ${oldLocations.length} déclaration(s) dans ${Object.keys(stats).length} pays\n`);

    // Vérifier les données dans la nouvelle base
    const { data: newLocations } = await newClient
      .from('location_declarations')
      .select('country_code')
      .order('created_at', { ascending: true });

    const newStats: Record<string, number> = {};
    if (newLocations) {
      for (const location of newLocations) {
        const code = (location.country_code || '').toUpperCase();
        if (code) {
          newStats[code] = (newStats[code] || 0) + 1;
        }
      }
    }

    console.log(`📦 ${newLocations?.length || 0} déclaration(s) déjà présente(s) dans la nouvelle base\n`);

    if (oldLocations.length > 0) {
      console.log('✅ Données prêtes à être migrées !');
      console.log('   Pour migrer, exécutez: npm run migrate-locations\n');
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'analyse:', error.message);
  }
}

analyzeLocations().catch(console.error);

