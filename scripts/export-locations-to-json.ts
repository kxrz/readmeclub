/**
 * Script d'export des déclarations de localisation vers JSON statique
 *
 * Ce script :
 * 1. Récupère toutes les déclarations de localisation depuis Supabase (janvier uniquement)
 * 2. Agrège par country_code
 * 3. Exporte vers public/data/locations.json
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Créer le client Supabase directement avec process.env (pour scripts Node.js)
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface LocationStats {
  stats: Record<string, number>; // country_code -> count
  total: number;
  countries: number;
  exportDate: string; // Date de l'export
  period: string; // Période des données (ex: "January 2025")
}

/**
 * Exporte les déclarations de localisation vers le JSON
 */
async function exportLocations(): Promise<void> {
  console.log('🚀 Début de l\'export des déclarations de localisation vers JSON statique...\n');

  const supabaseAdmin = getSupabaseAdmin();

  // Récupérer TOUTES les déclarations (pas de filtre de date)
  console.log('📅 Récupération de toutes les déclarations de localisation...\n');

  const { data: allDeclarations, error: fetchError } = await supabaseAdmin
    .from('location_declarations')
    .select('country_code, created_at')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des déclarations:', fetchError);
    process.exit(1);
  }

  if (!allDeclarations || allDeclarations.length === 0) {
    console.log('✅ Aucune déclaration de localisation trouvée pour janvier 2026.');

    // Créer un JSON vide avec structure valide
    const emptyStats: LocationStats = {
      stats: {},
      total: 0,
      countries: 0,
      exportDate: new Date().toISOString(),
      period: 'January 2026',
    };

    const indexPath = path.join(projectRoot, 'public', 'data', 'locations.json');
    await fs.mkdir(path.dirname(indexPath), { recursive: true });
    await fs.writeFile(indexPath, JSON.stringify(emptyStats, null, 2), 'utf-8');

    console.log('✅ Fichier JSON créé (vide).');
    return;
  }

  console.log(`📦 ${allDeclarations.length} déclaration(s) trouvée(s).`);

  // Agrégation par country_code
  const stats: Record<string, number> = {};
  for (const declaration of allDeclarations) {
    const code = (declaration.country_code || '').toUpperCase();
    if (code && code.length === 2) {
      stats[code] = (stats[code] || 0) + 1;
    }
  }

  const total = allDeclarations.length;
  const countries = Object.keys(stats).length;

  console.log(`📊 Répartition par pays:`);
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  for (const [code, count] of sortedStats) {
    console.log(`   ${code}: ${count} déclaration(s)`);
  }
  console.log(`\n📈 Total: ${total} déclaration(s) dans ${countries} pays\n`);

  // Déterminer la période des données
  const dates = allDeclarations.map(d => new Date(d.created_at));
  const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
  const newest = new Date(Math.max(...dates.map(d => d.getTime())));
  const period = oldest.getFullYear() === newest.getFullYear() 
    ? `${oldest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${newest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    : 'All time';

  // Préparer les données pour l'export
  const locationStats: LocationStats = {
    stats,
    total,
    countries,
    exportDate: new Date().toISOString(),
    period,
  };

  // Créer le dossier si nécessaire
  const indexPath = path.join(projectRoot, 'public', 'data', 'locations.json');
  await fs.mkdir(path.dirname(indexPath), { recursive: true });

  // Écrire le fichier JSON
  await fs.writeFile(
    indexPath,
    JSON.stringify(locationStats, null, 2),
    'utf-8'
  );

  console.log(`✅ Statistiques exportées vers ${indexPath}`);
  console.log(`   - Total: ${total} déclarations`);
  console.log(`   - Pays: ${countries}`);
  console.log(`   - Période: ${period}`);
  console.log('\n✅ Export terminé avec succès !');
}

// Exécuter le script
exportLocations().catch((error) => {
  console.error('❌ Erreur fatale lors de l\'export:', error);
  process.exit(1);
});
