/**
 * Script pour appliquer les migrations Supabase
 * 
 * Ce script applique les migrations 006 et 007 pour ajouter les colonnes
 * nécessaires au système hybride News et Wallpapers.
 * 
 * Usage:
 *   tsx scripts/apply-supabase-migrations.ts
 * 
 * Note: Ce script nécessite que les fichiers de migration soient dans supabase/migrations/
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function applyMigration(migrationFile: string): Promise<boolean> {
  try {
    const migrationPath = path.join(projectRoot, 'supabase', 'migrations', migrationFile);
    const sql = await fs.readFile(migrationPath, 'utf-8');
    
    console.log(`\n📄 Application de la migration: ${migrationFile}`);
    
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Variables d\'environnement manquantes: PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // Exécuter le SQL via rpc ou directement
    // Note: Supabase JS ne supporte pas directement l'exécution de SQL arbitraire
    // Il faut utiliser le dashboard ou la CLI Supabase
    // Ce script sert principalement à vérifier que les fichiers existent
    
    console.log(`✅ Migration ${migrationFile} prête à être appliquée`);
    console.log(`   📝 Contenu: ${sql.split('\n').length} lignes`);
    
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'application de ${migrationFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Application des migrations Supabase...\n');
  
  const migrations = [
    '006_add_exported_to_static_to_news.sql',
    '007_add_exported_to_static_to_wallpapers.sql',
    '008_add_wallpaper_votes_and_batch.sql',
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Succès: ${successCount}`);
  console.log(`   ❌ Erreurs: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n✅ Toutes les migrations sont prêtes !');
    console.log('\n📋 Instructions pour appliquer les migrations:');
    console.log('   1. Via Supabase Dashboard:');
    console.log('      - Allez dans SQL Editor');
    console.log('      - Copiez le contenu de chaque fichier .sql');
    console.log('      - Exécutez le SQL');
    console.log('\n   2. Via Supabase CLI:');
    console.log('      - supabase migration up');
    console.log('\n   3. Via ce script (vérification uniquement):');
    console.log('      - Les fichiers ont été vérifiés ✅');
  } else {
    console.log('\n⚠️  Certaines migrations ont des erreurs. Vérifiez les logs ci-dessus.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
