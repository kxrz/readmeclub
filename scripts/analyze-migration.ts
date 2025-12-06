/**
 * Script d'analyse pour la migration des ressources depuis l'ancien Supabase
 * 
 * Ce script analyse les ressources existantes et identifie :
 * - Les assets stockés en externe à rapatrier
 * - Les données à nettoyer
 * - Les mappings nécessaires
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement depuis .env
config();

// Configuration de l'ancien Supabase
const OLD_SUPABASE_URL = process.env.OLD_PUBLIC_SUPABASE_URL || '';
const OLD_SUPABASE_KEY = process.env.OLD_PUBLIC_SUPABASE_ANON_KEY || '';
const OLD_SUPABASE_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_ROLE_KEY || '';

// Configuration du nouveau Supabase
const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const NEW_SUPABASE_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || '';
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface OldResource {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url?: string;
  thumbnail_url?: string;
  external_link?: string;
  tags?: string[];
  [key: string]: any;
}

interface AnalysisResult {
  totalResources: number;
  resourcesWithExternalAssets: OldResource[];
  resourcesWithExternalThumbnails: OldResource[];
  resourcesNeedingCleanup: OldResource[];
  typeDistribution: Record<string, number>;
  missingFields: Record<string, number>;
}

async function analyzeResources() {
  if (!OLD_SUPABASE_URL || !OLD_SUPABASE_KEY) {
    console.error('❌ Veuillez configurer OLD_PUBLIC_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const oldClient = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

  console.log('🔍 Analyse des ressources existantes...\n');

  // Récupérer toutes les ressources
  const { data: resources, error } = await oldClient
    .from('resources')
    .select('*');

  if (error) {
    console.error('❌ Erreur lors de la récupération:', error);
    process.exit(1);
  }

  if (!resources || resources.length === 0) {
    console.log('ℹ️  Aucune ressource trouvée');
    return;
  }

  const analysis: AnalysisResult = {
    totalResources: resources.length,
    resourcesWithExternalAssets: [],
    resourcesWithExternalThumbnails: [],
    resourcesNeedingCleanup: [],
    typeDistribution: {},
    missingFields: {},
  };

  // Analyser chaque ressource
  resources.forEach((resource: OldResource) => {
    // Distribution par type
    const type = resource.type || 'unknown';
    analysis.typeDistribution[type] = (analysis.typeDistribution[type] || 0) + 1;

    // Vérifier les assets externes (Airtable, URLs externes, ou ancien Supabase)
    if (resource.file_url) {
      const isAirtable = resource.file_url.includes('airtableusercontent.com');
      const isOldSupabase = OLD_SUPABASE_URL && resource.file_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '');
      const isExternal = !resource.file_url.includes('supabase.co') || isOldSupabase || isAirtable;
      
      if (isExternal) {
        analysis.resourcesWithExternalAssets.push(resource);
      }
    }

    // Vérifier les thumbnails externes
    if (resource.thumbnail_url) {
      const isAirtable = resource.thumbnail_url.includes('airtableusercontent.com');
      const isOldSupabase = OLD_SUPABASE_URL && resource.thumbnail_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '');
      const isExternal = !resource.thumbnail_url.includes('supabase.co') || isOldSupabase || isAirtable;
      
      if (isExternal) {
        analysis.resourcesWithExternalThumbnails.push(resource);
      }
    }

    // Vérifier les champs manquants
    if (!resource.description) {
      analysis.missingFields.description = (analysis.missingFields.description || 0) + 1;
    }
    if (!resource.tags || resource.tags.length === 0) {
      analysis.missingFields.tags = (analysis.missingFields.tags || 0) + 1;
    }

    // Ressources nécessitant un nettoyage
    if (
      !resource.description ||
      resource.description.length < 10 ||
      resource.title.length < 3
    ) {
      analysis.resourcesNeedingCleanup.push(resource);
    }
  });

  // Afficher les résultats
  console.log('📊 Résultats de l\'analyse:\n');
  console.log(`Total de ressources: ${analysis.totalResources}\n`);

  console.log('📈 Distribution par type:');
  Object.entries(analysis.typeDistribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

  console.log(`\n🔗 Ressources avec assets externes: ${analysis.resourcesWithExternalAssets.length}`);
  if (analysis.resourcesWithExternalAssets.length > 0) {
    console.log('  Exemples:');
    analysis.resourcesWithExternalAssets.slice(0, 5).forEach((r) => {
      console.log(`    - ${r.title}: ${r.file_url}`);
    });
  }

  console.log(`\n🖼️  Ressources avec thumbnails externes: ${analysis.resourcesWithExternalThumbnails.length}`);
  if (analysis.resourcesWithExternalThumbnails.length > 0) {
    console.log('  Exemples:');
    analysis.resourcesWithExternalThumbnails.slice(0, 5).forEach((r) => {
      console.log(`    - ${r.title}: ${r.thumbnail_url}`);
    });
  }

  console.log(`\n🧹 Ressources nécessitant un nettoyage: ${analysis.resourcesNeedingCleanup.length}`);

  console.log('\n⚠️  Champs manquants:');
  Object.entries(analysis.missingFields).forEach(([field, count]) => {
    console.log(`  - ${field}: ${count}`);
  });

  // Sauvegarder le rapport
  const reportPath = path.join(process.cwd(), 'migration-analysis.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(analysis, null, 2)
  );

  console.log(`\n💾 Rapport sauvegardé dans: ${reportPath}`);

  // Générer un script de migration
  generateMigrationScript(resources, analysis);
}

function generateMigrationScript(resources: OldResource[], analysis: AnalysisResult) {
  const scriptPath = path.join(process.cwd(), 'scripts', 'migrate-resources.ts');
  
  const script = `/**
 * Script de migration généré automatiquement
 * 
 * Ce script migre les ressources depuis l'ancien Supabase vers le nouveau.
 * 
 * AVANT DE LANCER:
 * 1. Vérifier les mappings de types
 * 2. Télécharger et uploader les assets externes
 * 3. Nettoyer les données si nécessaire
 * 
 * Usage: npm run migrate-resources
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement depuis .env
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

const oldClient = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

// Mapping des types si nécessaire
const typeMapping: Record<string, string> = {
  // Ajouter les mappings ici si les types ont changé
};

async function downloadAndUploadAsset(url: string, bucket: string, fileName: string): Promise<string | null> {
  try {
    // Télécharger l'asset
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(\`⚠️  Impossible de télécharger: \${url}\`);
      return null;
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload vers Supabase Storage
    const { data, error } = await newClient.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: blob.type,
        upsert: false,
      });

    if (error) {
      console.error(\`❌ Erreur upload: \${error.message}\`);
      return null;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = newClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error(\`❌ Erreur lors du téléchargement/upload: \${error}\`);
    return null;
  }
}

async function migrateResource(resource: any) {
  try {
    // Mapper le type si nécessaire
    const mappedType = typeMapping[resource.type] || resource.type;

    // Préparer les données
    const newResource = {
      type: mappedType,
      title: resource.title,
      description: resource.description || 'No description',
      version: resource.version,
      compatibility: resource.compatibility,
      installation_instructions: resource.installation_instructions,
      known_issues: resource.known_issues,
      external_link: resource.external_link,
      contributor_name: resource.contributor_name,
      contact_info: resource.contact_info,
      tags: resource.tags || [],
      status: 'approved', // Approuvé par défaut
      hidden: false,
      downloads_count: resource.downloads_count || 0,
    };

    // Gérer les assets externes
    if (resource.file_url) {
      const isOldSupabase = OLD_SUPABASE_URL && resource.file_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '');
      if (!resource.file_url.includes('supabase.co') || isOldSupabase) {
        // Asset externe ou de l'ancien Supabase - télécharger et uploader
        const fileName = \`migrated/\${Date.now()}-\${resource.id}\`;
        const newUrl = await downloadAndUploadAsset(
          resource.file_url,
          'resources',
          fileName
        );
        if (newUrl) {
          newResource.file_url = newUrl;
          newResource.file_name = resource.file_name || 'migrated-file';
        }
      } else {
        // Déjà dans le nouveau Supabase - garder tel quel
        newResource.file_url = resource.file_url;
        newResource.file_name = resource.file_name;
      }
    }

    // Gérer les thumbnails externes
    if (resource.thumbnail_url) {
      if (!resource.thumbnail_url.includes('supabase.co') || resource.thumbnail_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0])) {
        // Thumbnail externe ou de l'ancien Supabase - télécharger et uploader
        const fileName = \`migrated/\${Date.now()}-\${resource.id}-thumb\`;
        const newUrl = await downloadAndUploadAsset(
          resource.thumbnail_url,
          'resources',
          fileName
        );
        if (newUrl) {
          newResource.thumbnail_url = newUrl;
        }
      } else {
        // Déjà dans Supabase (nouveau projet) - garder tel quel
        newResource.thumbnail_url = resource.thumbnail_url;
      }
    }

    // Insérer dans le nouveau Supabase
    const { data, error } = await newClient
      .from('resources')
      .insert(newResource)
      .select()
      .single();

    if (error) {
      console.error(\`❌ Erreur migration \${resource.title}: \${error.message}\`);
      return false;
    }

    console.log(\`✅ Migré: \${resource.title}\`);
    return true;
  } catch (error) {
    console.error(\`❌ Erreur migration \${resource.title}: \${error}\`);
    return false;
  }
}

async function migrate() {
  console.log('🚀 Début de la migration...\\n');

  // Récupérer toutes les ressources
  const { data: resources, error } = await oldClient
    .from('resources')
    .select('*');

  if (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }

  if (!resources || resources.length === 0) {
    console.log('ℹ️  Aucune ressource à migrer');
    return;
  }

  console.log(\`📦 \${resources.length} ressources à migrer\\n\`);

  let success = 0;
  let failed = 0;

  // Migrer chaque ressource
  for (const resource of resources) {
    const result = await migrateResource(resource);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Pause pour éviter de surcharger
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(\`\\n✅ Migration terminée: \${success} réussies, \${failed} échouées\`);
}

// Lancer la migration
migrate().catch(console.error);
`;

  fs.writeFileSync(scriptPath, script);
  console.log(`📝 Script de migration généré: ${scriptPath}`);
}

// Lancer l'analyse
analyzeResources().catch(console.error);

