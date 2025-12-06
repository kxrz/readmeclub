/**
 * Script pour vérifier les doublons dans les ressources
 * 
 * Usage: npm run check-duplicates
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

// Normaliser une URL pour la comparaison
function normalizeUrl(url: string): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    urlObj.search = '';
    urlObj.hash = '';
    urlObj.pathname = urlObj.pathname.replace(/\/+/g, '/');
    return urlObj.toString().toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

// Normaliser un titre pour la comparaison
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 100);
}

async function checkSpecificResource(searchTerm: string) {
  console.log(`🔍 Recherche de "${searchTerm}"...\n`);

  const { data: resources, error } = await newClient
    .from('resources')
    .select('id, title, description, file_url, external_link, created_at, downloads_count, type')
    .ilike('title', `%${searchTerm}%`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log(`ℹ️  Aucune ressource trouvée pour "${searchTerm}"`);
    return;
  }

  console.log(`📦 ${resources.length} ressource(s) trouvée(s):\n`);

  resources.forEach((resource, index) => {
    console.log(`${index + 1}. "${resource.title}"`);
    console.log(`   ID: ${resource.id}`);
    console.log(`   Type: ${resource.type}`);
    console.log(`   Créé le: ${new Date(resource.created_at).toLocaleDateString()}`);
    console.log(`   Téléchargements: ${resource.downloads_count}`);
    if (resource.file_url) {
      console.log(`   File URL: ${resource.file_url.substring(0, 80)}...`);
    }
    if (resource.external_link) {
      console.log(`   External Link: ${resource.external_link.substring(0, 80)}...`);
    }
    console.log('');
  });

  // Vérifier les doublons parmi ces ressources
  if (resources.length > 1) {
    console.log('⚠️  Doublons potentiels détectés!\n');
    
    const normalizedTitles = resources.map(r => normalizeTitle(r.title));
    const normalizedUrls = resources.map(r => normalizeUrl(r.file_url || r.external_link || ''));
    
    // Vérifier les titres normalisés identiques
    const titleGroups = new Map<string, typeof resources>();
    resources.forEach(r => {
      const normalized = normalizeTitle(r.title);
      if (!titleGroups.has(normalized)) {
        titleGroups.set(normalized, []);
      }
      titleGroups.get(normalized)!.push(r);
    });
    
    // Vérifier les URLs normalisées identiques
    const urlGroups = new Map<string, typeof resources>();
    resources.forEach(r => {
      const normalized = normalizeUrl(r.file_url || r.external_link || '');
      if (normalized) {
        if (!urlGroups.has(normalized)) {
          urlGroups.set(normalized, []);
        }
        urlGroups.get(normalized)!.push(r);
      }
    });
    
    let hasDuplicates = false;
    
    for (const [title, items] of titleGroups.entries()) {
      if (items.length > 1) {
        console.log(`📋 Titre normalisé identique: "${title}"`);
        items.forEach(item => {
          console.log(`   - ${item.title} (ID: ${item.id}, créé le ${new Date(item.created_at).toLocaleDateString()})`);
        });
        console.log('');
        hasDuplicates = true;
      }
    }
    
    for (const [url, items] of urlGroups.entries()) {
      if (items.length > 1 && url) {
        console.log(`📋 URL normalisée identique: ${url.substring(0, 60)}...`);
        items.forEach(item => {
          console.log(`   - ${item.title} (ID: ${item.id}, créé le ${new Date(item.created_at).toLocaleDateString()})`);
        });
        console.log('');
        hasDuplicates = true;
      }
    }
    
    if (!hasDuplicates) {
      console.log('ℹ️  Les ressources ont des titres ou URLs différents');
    }
  }
}

async function checkAllDuplicates() {
  console.log('🔍 Analyse complète des doublons...\n');

  const { data: resources, error } = await newClient
    .from('resources')
    .select('id, title, description, file_url, external_link, created_at, downloads_count, type')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log('ℹ️  Aucune ressource trouvée');
    return;
  }

  console.log(`📦 ${resources.length} ressources au total\n`);

  // Grouper par titre normalisé
  const byTitle = new Map<string, typeof resources>();
  resources.forEach(r => {
    const normalized = normalizeTitle(r.title);
    if (!byTitle.has(normalized)) {
      byTitle.set(normalized, []);
    }
    byTitle.get(normalized)!.push(r);
  });

  // Grouper par URL normalisée
  const byUrl = new Map<string, typeof resources>();
  resources.forEach(r => {
    const url = normalizeUrl(r.file_url || r.external_link || '');
    if (url) {
      if (!byUrl.has(url)) {
        byUrl.set(url, []);
      }
      byUrl.get(url)!.push(r);
    }
  });

  console.log('📊 Doublons par titre normalisé:\n');
  let titleDuplicates = 0;
  for (const [title, items] of byTitle.entries()) {
    if (items.length > 1) {
      titleDuplicates += items.length - 1;
      console.log(`"${title}" (${items.length} occurrences):`);
      items.forEach(item => {
        console.log(`   - ${item.title} (ID: ${item.id}, ${item.type}, ${new Date(item.created_at).toLocaleDateString()}, ${item.downloads_count} dl)`);
      });
      console.log('');
    }
  }

  if (titleDuplicates === 0) {
    console.log('✅ Aucun doublon par titre\n');
  } else {
    console.log(`⚠️  ${titleDuplicates} doublon(s) potentiel(s) par titre\n`);
  }

  console.log('📊 Doublons par URL normalisée:\n');
  let urlDuplicates = 0;
  for (const [url, items] of byUrl.entries()) {
    if (items.length > 1) {
      urlDuplicates += items.length - 1;
      console.log(`${url.substring(0, 60)}... (${items.length} occurrences):`);
      items.forEach(item => {
        console.log(`   - ${item.title} (ID: ${item.id}, ${item.type}, ${new Date(item.created_at).toLocaleDateString()}, ${item.downloads_count} dl)`);
      });
      console.log('');
    }
  }

  if (urlDuplicates === 0) {
    console.log('✅ Aucun doublon par URL\n');
  } else {
    console.log(`⚠️  ${urlDuplicates} doublon(s) potentiel(s) par URL\n`);
  }

  console.log(`\n📈 Résumé:`);
  console.log(`   Total ressources: ${resources.length}`);
  console.log(`   Doublons par titre: ${titleDuplicates}`);
  console.log(`   Doublons par URL: ${urlDuplicates}`);
}

async function main() {
  const searchTerm = process.argv[2];
  
  if (searchTerm) {
    await checkSpecificResource(searchTerm);
  } else {
    await checkAllDuplicates();
  }
}

main().catch(console.error);

