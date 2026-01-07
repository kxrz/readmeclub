/**
 * Script d'export des resources vers JSON statique
 * 
 * Ce script :
 * 1. Récupère toutes les resources approuvées depuis Supabase
 * 2. Exporte vers public/resources/index.json
 * 3. Marque les resources comme exported_to_static
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

interface ResourceData {
  id: string;
  type: string;
  title: string;
  description: string;
  version?: string;
  compatibility?: string;
  installation_instructions?: string;
  known_issues?: string;
  file_url?: string;
  file_name?: string;
  external_link?: string;
  thumbnail_url?: string;
  contributor_name?: string;
  contact_info?: string;
  tags: string[];
  downloads_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Exporte une ressource vers le JSON
 */
async function exportResources(): Promise<void> {
  console.log('🚀 Début de l\'export des Resources vers JSON statique...\n');
  
  const supabaseAdmin = getSupabaseAdmin();
  
  // Récupérer toutes les resources approuvées
  const { data: allResources, error: fetchError } = await supabaseAdmin
    .from('resources')
    .select('*')
    .eq('status', 'approved')
    .eq('hidden', false)
    .order('created_at', { ascending: false });
  
  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des resources:', fetchError);
    process.exit(1);
  }
  
  if (!allResources || allResources.length === 0) {
    console.log('✅ Aucune resource à exporter.');
    
    // Créer un index JSON vide
    const indexPath = path.join(projectRoot, 'public', 'resources', 'index.json');
    await fs.mkdir(path.dirname(indexPath), { recursive: true });
    await fs.writeFile(indexPath, JSON.stringify([], null, 2), 'utf-8');
    
    console.log('✅ Index JSON créé (vide).');
    return;
  }
  
  console.log(`📦 ${allResources.length} resources trouvées.`);
  
  // Préparer les données pour l'export (sans les champs internes)
  const resourcesToExport: ResourceData[] = allResources.map((resource: any) => ({
    id: resource.id,
    type: resource.type,
    title: resource.title,
    description: resource.description,
    version: resource.version || undefined,
    compatibility: resource.compatibility || undefined,
    installation_instructions: resource.installation_instructions || undefined,
    known_issues: resource.known_issues || undefined,
    file_url: resource.file_url || undefined,
    file_name: resource.file_name || undefined,
    external_link: resource.external_link || undefined,
    thumbnail_url: resource.thumbnail_url || undefined,
    contributor_name: resource.contributor_name || undefined,
    contact_info: resource.contact_info || undefined,
    tags: resource.tags || [],
    downloads_count: resource.downloads_count || 0,
    created_at: resource.created_at,
    updated_at: resource.updated_at,
  }));
  
  // Créer le dossier si nécessaire
  const indexPath = path.join(projectRoot, 'public', 'resources', 'index.json');
  await fs.mkdir(path.dirname(indexPath), { recursive: true });
  
  // Écrire le fichier JSON
  await fs.writeFile(
    indexPath,
    JSON.stringify(resourcesToExport, null, 2),
    'utf-8'
  );
  
  console.log(`✅ ${resourcesToExport.length} resources exportées vers ${indexPath}`);
  
  // Marquer toutes les resources comme exported_to_static
  const resourceIds = allResources.map((r: any) => r.id);
  const { error: updateError } = await supabaseAdmin
    .from('resources')
    .update({ 
      exported_to_static: true,
      pending_export: false,
    })
    .in('id', resourceIds);
  
  if (updateError) {
    console.error('⚠️  Erreur lors de la mise à jour du statut d\'export:', updateError);
  } else {
    console.log(`✅ ${resourceIds.length} resources marquées comme exportées.`);
  }
  
  console.log('\n✅ Export terminé avec succès !');
}

// Exécuter le script
exportResources().catch((error) => {
  console.error('❌ Erreur fatale lors de l\'export:', error);
  process.exit(1);
});
