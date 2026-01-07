/**
 * Script de diagnostic pour vérifier les données de localisation dans Supabase
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function checkLocationsData() {
  console.log('🔍 Vérification des données de localisation dans Supabase...\n');

  const supabaseAdmin = getSupabaseAdmin();

  // Récupérer TOUTES les déclarations (sans filtre de date)
  const { data: allDeclarations, error: fetchError } = await supabaseAdmin
    .from('location_declarations')
    .select('country_code, created_at')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération:', fetchError);
    process.exit(1);
  }

  if (!allDeclarations || allDeclarations.length === 0) {
    console.log('ℹ️  Aucune déclaration de localisation trouvée dans la base de données.\n');
    return;
  }

  console.log(`📦 Total de déclarations trouvées: ${allDeclarations.length}\n`);

  // Analyser les dates
  const dates = allDeclarations.map(d => new Date(d.created_at));
  const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
  const newest = new Date(Math.max(...dates.map(d => d.getTime())));

  console.log('📅 Plage de dates:');
  console.log(`   Plus ancienne: ${oldest.toISOString()} (${oldest.toLocaleDateString('fr-FR')})`);
  console.log(`   Plus récente: ${newest.toISOString()} (${newest.toLocaleDateString('fr-FR')})\n`);

  // Grouper par mois/année
  const byMonth: Record<string, number> = {};
  for (const declaration of allDeclarations) {
    const date = new Date(declaration.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
  }

  console.log('📊 Répartition par mois:');
  const sortedMonths = Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [month, count] of sortedMonths) {
    console.log(`   ${month}: ${count} déclaration(s)`);
  }
  console.log();

  // Vérifier spécifiquement janvier 2025 et janvier 2026
  const jan2025Start = new Date('2025-01-01T00:00:00Z');
  const jan2025End = new Date('2025-01-31T23:59:59Z');
  const jan2026Start = new Date('2026-01-01T00:00:00Z');
  const jan2026End = new Date('2026-01-31T23:59:59Z');

  const jan2025Count = allDeclarations.filter(d => {
    const date = new Date(d.created_at);
    return date >= jan2025Start && date <= jan2025End;
  }).length;

  const jan2026Count = allDeclarations.filter(d => {
    const date = new Date(d.created_at);
    return date >= jan2026Start && date <= jan2026End;
  }).length;

  console.log('🔍 Vérification spécifique:');
  console.log(`   Janvier 2025: ${jan2025Count} déclaration(s)`);
  console.log(`   Janvier 2026: ${jan2026Count} déclaration(s)\n`);

  // Agrégation par pays (toutes les données)
  const stats: Record<string, number> = {};
  for (const declaration of allDeclarations) {
    const code = (declaration.country_code || '').toUpperCase();
    if (code && code.length === 2) {
      stats[code] = (stats[code] || 0) + 1;
    }
  }

  console.log('🌍 Répartition par pays (toutes les données):');
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  for (const [code, count] of sortedStats.slice(0, 10)) {
    console.log(`   ${code}: ${count} déclaration(s)`);
  }
  if (sortedStats.length > 10) {
    console.log(`   ... et ${sortedStats.length - 10} autres pays`);
  }
  console.log();
}

checkLocationsData().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
