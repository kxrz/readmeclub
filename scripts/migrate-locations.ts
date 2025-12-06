/**
 * Script pour migrer les déclarations de localisation depuis l'ancien Supabase
 * 
 * Usage: npm run migrate-locations
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

async function migrateLocations() {
  console.log('🚀 Migration des déclarations de localisation...\n');

  try {
    // Récupérer toutes les déclarations de l'ancienne base
    const { data: oldLocations, error: oldError } = await oldClient
      .from('location_declarations')
      .select('*')
      .order('created_at', { ascending: true });

    if (oldError) {
      console.log(`⚠️  Table 'location_declarations' non trouvée dans l'ancienne base: ${oldError.message}`);
      console.log('ℹ️  Aucune donnée à migrer.\n');
      return;
    }

    if (!oldLocations || oldLocations.length === 0) {
      console.log('ℹ️  Aucune déclaration de localisation à migrer.\n');
      return;
    }

    console.log(`📦 ${oldLocations.length} déclaration(s) à migrer\n`);

    // Récupérer les déclarations existantes dans la nouvelle base pour éviter les doublons
    const { data: existingLocations } = await newClient
      .from('location_declarations')
      .select('country_code, created_at');

    const existingSet = new Set<string>();
    if (existingLocations) {
      for (const loc of existingLocations) {
        const key = `${loc.country_code?.toUpperCase()}_${loc.created_at}`;
        existingSet.add(key);
      }
    }

    let migrated = 0;
    let skipped = 0;

    // Migrer chaque déclaration
    for (const location of oldLocations) {
      const countryCode = (location.country_code || '').toUpperCase();
      
      if (!countryCode || countryCode.length !== 2) {
        console.log(`⚠️  Code pays invalide ignoré: ${location.country_code}`);
        skipped++;
        continue;
      }

      const key = `${countryCode}_${location.created_at}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      try {
        const { error: insertError } = await newClient
          .from('location_declarations')
          .insert({
            country_code: countryCode,
            created_at: location.created_at || new Date().toISOString(),
          });

        if (insertError) {
          console.error(`❌ Erreur migration ${countryCode}: ${insertError.message}`);
          skipped++;
        } else {
          migrated++;
          if (migrated % 10 === 0) {
            console.log(`   ✅ ${migrated} déclaration(s) migrée(s)...`);
          }
        }
      } catch (error: any) {
        console.error(`❌ Erreur migration ${countryCode}: ${error.message}`);
        skipped++;
      }
    }

    console.log(`\n✅ Migration terminée:`);
    console.log(`   ✅ ${migrated} déclaration(s) migrée(s)`);
    console.log(`   ⏭️  ${skipped} déclaration(s) ignorée(s) (doublons ou invalides)\n`);
  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error.message);
  }
}

migrateLocations().catch(console.error);

