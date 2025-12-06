/**
 * Script pour nettoyer les doublons de wallpapers et ressources
 * 
 * Ce script identifie et supprime les doublons en gardant le plus ancien exemplaire
 * 
 * Usage: npm run clean-duplicates
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement depuis .env
config();

const NEW_SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const NEW_SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

async function checkFileExistsInStorage(fileUrl: string, bucket: string): Promise<boolean> {
  if (!fileUrl) return false;
  
  try {
    // Si ce n'est pas une URL Supabase, considérer comme existant (URL externe)
    if (!fileUrl.includes('supabase.co') && !fileUrl.includes('supabase')) {
      return true;
    }

    // Extraire le chemin du fichier depuis l'URL Supabase
    // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    const urlPattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
    let match = fileUrl.match(urlPattern);
    
    // Essayer aussi avec le format direct: /[bucket]/[path]
    if (!match) {
      const directPattern = new RegExp(`/${bucket}/(.+)$`);
      match = fileUrl.match(directPattern);
    }
    
    if (!match) {
      // Si on ne peut pas extraire le chemin, considérer comme manquant pour nettoyer
      console.warn(`   ⚠️  Impossible d'extraire le chemin de l'URL: ${fileUrl.substring(0, 80)}...`);
      return false; // Considérer comme manquant pour nettoyer
    }
    
    const filePath = decodeURIComponent(match[1]); // Décoder l'URL encodée
    
    // Vérifier si le fichier existe dans le bucket en listant les fichiers
    try {
      const { data: listData, error: listError } = await newClient.storage
        .from(bucket)
        .list(filePath.split('/').slice(0, -1).join('/') || '', {
          search: filePath.split('/').pop(),
        });

      if (!listError && listData && listData.length > 0) {
        // Vérifier si c'est exactement le même fichier
        const exactMatch = listData.find(file => {
          const fullPath = filePath.split('/').slice(0, -1).join('/') 
            ? `${filePath.split('/').slice(0, -1).join('/')}/${file.name}`
            : file.name;
          return fullPath === filePath || file.name === filePath.split('/').pop();
        });
        
        if (exactMatch) {
          return true;
        }
      }
    } catch (e) {
      // Continuer avec la méthode de téléchargement
    }
    
    // Essayer de télécharger le fichier pour vérifier son existence
    const { data, error } = await newClient.storage
      .from(bucket)
      .download(filePath);
    
    if (error) {
      // Si erreur 404 ou "not found", le fichier n'existe pas
      if (error.message.includes('404') || 
          error.message.includes('not found') || 
          error.message.includes('The resource was not found') ||
          error.statusCode === 404) {
        return false;
      }
      // Pour les autres erreurs, considérer comme manquant pour nettoyer
      console.warn(`   ⚠️  Erreur vérification fichier: ${error.message}`);
      return false;
    }
    
    return !!data;
  } catch (error: any) {
    // En cas d'erreur, considérer comme manquant pour nettoyer
    console.warn(`   ⚠️  Exception lors de la vérification: ${error.message}`);
    return false;
  }
}

async function cleanWallpaperDuplicates(dryRun: boolean = false) {
  console.log('🖼️  Nettoyage des doublons de wallpapers...\n');

  // Récupérer tous les wallpapers
  const { data: wallpapers, error } = await newClient
    .from('wallpapers')
    .select('id, title, file_url, created_at, download_count')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur récupération wallpapers:', error);
    return;
  }

  if (!wallpapers || wallpapers.length === 0) {
    console.log('ℹ️  Aucun wallpaper à nettoyer');
    return;
  }

  console.log(`📦 ${wallpapers.length} wallpapers trouvés\n`);

  // Vérifier les fichiers manquants dans Storage
  console.log('🔍 Vérification des fichiers dans Supabase Storage...\n');
  const missingFiles: string[] = [];
  
  for (const wallpaper of wallpapers) {
    if (wallpaper.file_url) {
      const exists = await checkFileExistsInStorage(wallpaper.file_url, 'wallpapers');
      if (!exists) {
        missingFiles.push(wallpaper.id);
        console.log(`⚠️  Fichier manquant pour wallpaper "${wallpaper.title || wallpaper.id}": ${wallpaper.file_url.substring(0, 80)}...`);
      }
    }
  }

  // Supprimer les wallpapers avec fichiers manquants
  if (missingFiles.length > 0) {
    console.log(`\n🗑️  Suppression de ${missingFiles.length} wallpapers avec fichiers manquants...\n`);
    for (const id of missingFiles) {
      const wallpaper = wallpapers.find(w => w.id === id);
      console.log(`   ❌ Suppression: ${wallpaper?.title || id}`);
      
        if (dryRun) {
          console.log(`   🔍 [DRY-RUN] Serait supprimé: ${wallpaper?.title || id}`);
        } else {
          const { error: deleteError } = await newClient
            .from('wallpapers')
            .delete()
            .eq('id', id);

          if (deleteError) {
            console.error(`   ❌ Erreur suppression ${id}: ${deleteError.message}`);
          }
        }
    }
    console.log('');
  } else {
    console.log('✅ Tous les fichiers existent dans Storage\n');
  }

  // Filtrer les wallpapers qui existent encore (après suppression des fichiers manquants)
  const existingWallpapers = wallpapers.filter(w => !missingFiles.includes(w.id));

  // Grouper par file_url
  const groupedByUrl = new Map<string, typeof wallpapers>();
  
  for (const wallpaper of existingWallpapers) {
    if (!wallpaper.file_url) continue;
    
    if (!groupedByUrl.has(wallpaper.file_url)) {
      groupedByUrl.set(wallpaper.file_url, []);
    }
    groupedByUrl.get(wallpaper.file_url)!.push(wallpaper);
  }

  // Identifier les doublons
  const duplicates: Array<{ url: string; items: typeof wallpapers; keep: string; remove: string[] }> = [];
  
  for (const [url, items] of groupedByUrl.entries()) {
    if (items.length > 1) {
      // Trier par date de création (garder le plus ancien)
      items.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      const keep = items[0];
      const remove = items.slice(1).map(item => item.id);
      
      duplicates.push({
        url,
        items,
        keep: keep.id,
        remove,
      });
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ Aucun doublon trouvé');
    return;
  }

  console.log(`⚠️  ${duplicates.length} groupes de doublons trouvés\n`);

  let totalRemoved = 0;
  let totalKept = 0;

  // Supprimer les doublons
  for (const duplicate of duplicates) {
    const keepItem = duplicate.items[0];
    console.log(`📋 Doublons pour: ${keepItem.title || 'Sans titre'}`);
    console.log(`   URL: ${duplicate.url.substring(0, 80)}...`);
    console.log(`   ✅ Garde: ${keepItem.id} (créé le ${new Date(keepItem.created_at).toLocaleDateString()}, ${keepItem.download_count} téléchargements)`);
    
    for (const removeId of duplicate.remove) {
      const removeItem = duplicate.items.find(item => item.id === removeId);
      console.log(`   ❌ Supprime: ${removeId} (créé le ${removeItem ? new Date(removeItem.created_at).toLocaleDateString() : 'N/A'}, ${removeItem?.download_count || 0} téléchargements)`);
      
      if (dryRun) {
        console.log(`   🔍 [DRY-RUN] Serait supprimé: ${removeId}`);
        totalRemoved++;
      } else {
        const { error: deleteError } = await newClient
          .from('wallpapers')
          .delete()
          .eq('id', removeId);

        if (deleteError) {
          console.error(`   ❌ Erreur suppression ${removeId}: ${deleteError.message}`);
        } else {
          totalRemoved++;
        }
      }
    }
    
    totalKept++;
    console.log('');
  }

  console.log(`\n✅ Nettoyage terminé:`);
  console.log(`   ✅ ${totalKept} wallpapers conservés`);
  console.log(`   🗑️  ${totalRemoved} doublons supprimés`);
}

// Normaliser une URL pour la comparaison (supprimer les paramètres, normaliser le chemin)
function normalizeUrl(url: string): string {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    // Supprimer les paramètres de requête
    urlObj.search = '';
    urlObj.hash = '';
    // Normaliser le chemin (supprimer les doubles slashes, etc.)
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
    .replace(/[^\w\s]/g, '') // Supprimer la ponctuation
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .substring(0, 100); // Limiter la longueur
}

async function cleanResourceDuplicates(dryRun: boolean = false) {
  console.log('📚 Nettoyage des doublons de ressources...\n');

  // Récupérer toutes les ressources
  const { data: resources, error } = await newClient
    .from('resources')
    .select('id, title, description, file_url, external_link, created_at, downloads_count, type')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur récupération ressources:', error);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log('ℹ️  Aucune ressource à nettoyer');
    return;
  }

  console.log(`📦 ${resources.length} ressources trouvées\n`);

  // Vérifier les fichiers manquants dans Storage
  console.log('🔍 Vérification des fichiers dans Supabase Storage...\n');
  const missingFiles: string[] = [];
  
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    if (resource.file_url && resource.file_url.includes('supabase.co')) {
      // Afficher la progression
      if ((i + 1) % 10 === 0) {
        console.log(`   Vérification ${i + 1}/${resources.length}...`);
      }
      
      const exists = await checkFileExistsInStorage(resource.file_url, 'resources');
      if (!exists) {
        missingFiles.push(resource.id);
        console.log(`⚠️  Fichier manquant pour ressource "${resource.title}": ${resource.file_url.substring(0, 80)}...`);
      }
    } else if (resource.file_url && !resource.external_link) {
      // Si file_url externe mais pas d'external_link, considérer comme manquant
      missingFiles.push(resource.id);
      console.log(`⚠️  Pas de fichier Supabase ni external_link pour ressource "${resource.title}"`);
    }
  }
  
  console.log(`\n📊 Résultat: ${missingFiles.length} fichiers manquants sur ${resources.length} ressources\n`);

  // Supprimer les ressources avec fichiers manquants (seulement si pas d'external_link)
  if (missingFiles.length > 0) {
    console.log(`\n🗑️  Suppression de ${missingFiles.length} ressources avec fichiers manquants...\n`);
    let deletedCount = 0;
    let keptCount = 0;
    for (const id of missingFiles) {
      const resource = resources.find(r => r.id === id);
      // Ne supprimer que si pas d'external_link (garder les ressources avec liens externes)
      if (resource && !resource.external_link) {
        console.log(`   ❌ Suppression: ${resource.title} (${id})`);
        
        if (dryRun) {
          console.log(`   🔍 [DRY-RUN] Serait supprimé: ${resource.title} (${id})`);
          deletedCount++;
        } else {
          const { error: deleteError } = await newClient
            .from('resources')
            .delete()
            .eq('id', id);

          if (deleteError) {
            console.error(`   ❌ Erreur suppression ${id}: ${deleteError.message}`);
          } else {
            deletedCount++;
          }
        }
      } else if (resource) {
        console.log(`   ⏭️  Conservation: ${resource.title} (a un external_link)`);
        keptCount++;
      }
    }
    console.log(`\n✅ ${deletedCount} ressources supprimées avec succès`);
    if (keptCount > 0) {
      console.log(`   ⏭️  ${keptCount} ressources conservées (ont un external_link)\n`);
    } else {
      console.log('');
    }
  } else {
    console.log('✅ Tous les fichiers existent dans Storage\n');
  }

  // Filtrer les ressources qui existent encore (après suppression des fichiers manquants)
  // MAIS on garde toutes les ressources pour la détection de doublons, même celles avec fichiers manquants
  // car on veut détecter les doublons par titre + external_link même si les fichiers sont différents
  const existingResources = resources; // On garde toutes les ressources pour la détection

  console.log(`🔍 Recherche de doublons parmi ${existingResources.length} ressources...\n`);

  // Grouper par différents critères pour détecter les doublons
  const groupedByFileUrl = new Map<string, typeof resources>();
  const groupedByNormalizedFileUrl = new Map<string, typeof resources>();
  const groupedByExternalLink = new Map<string, typeof resources>();
  const groupedByNormalizedExternalLink = new Map<string, typeof resources>();
  const groupedByTitle = new Map<string, typeof resources>();
  const groupedByTitleAndExternalLink = new Map<string, typeof resources>();
  const groupedByTitleAndFile = new Map<string, typeof resources>();
  
  for (const resource of existingResources) {
    // Grouper par file_url exact
    if (resource.file_url) {
      if (!groupedByFileUrl.has(resource.file_url)) {
        groupedByFileUrl.set(resource.file_url, []);
      }
      groupedByFileUrl.get(resource.file_url)!.push(resource);
      
      // Grouper par file_url normalisé (sans paramètres)
      const normalizedUrl = normalizeUrl(resource.file_url);
      if (normalizedUrl) {
        if (!groupedByNormalizedFileUrl.has(normalizedUrl)) {
          groupedByNormalizedFileUrl.set(normalizedUrl, []);
        }
        groupedByNormalizedFileUrl.get(normalizedUrl)!.push(resource);
        
        // Grouper par titre normalisé + file_url normalisé
        const normalizedTitle = normalizeTitle(resource.title);
        if (normalizedTitle) {
          const titleAndFileKey = `${normalizedTitle}::${normalizedUrl}`;
          if (!groupedByTitleAndFile.has(titleAndFileKey)) {
            groupedByTitleAndFile.set(titleAndFileKey, []);
          }
          groupedByTitleAndFile.get(titleAndFileKey)!.push(resource);
        }
      }
    }
    
    // Grouper par external_link exact
    if (resource.external_link) {
      const key = `${resource.external_link}::${resource.title}`;
      if (!groupedByExternalLink.has(key)) {
        groupedByExternalLink.set(key, []);
      }
      groupedByExternalLink.get(key)!.push(resource);
      
      // Grouper par external_link normalisé + titre normalisé
      const normalizedExtLink = normalizeUrl(resource.external_link);
      const normalizedTitle = normalizeTitle(resource.title);
      const normalizedKey = `${normalizedExtLink}::${normalizedTitle}`;
      if (normalizedKey && normalizedKey !== '::') {
        if (!groupedByNormalizedExternalLink.has(normalizedKey)) {
          groupedByNormalizedExternalLink.set(normalizedKey, []);
        }
        groupedByNormalizedExternalLink.get(normalizedKey)!.push(resource);
      }
    }
    
    // Grouper par titre normalisé (pour détecter les titres similaires)
    const normalizedTitle = normalizeTitle(resource.title);
    if (normalizedTitle && normalizedTitle.length > 5) {
      if (!groupedByTitle.has(normalizedTitle)) {
        groupedByTitle.set(normalizedTitle, []);
      }
      groupedByTitle.get(normalizedTitle)!.push(resource);
      
      // Grouper par titre normalisé + external_link normalisé
      const normalizedExtLink = normalizeUrl(resource.external_link || '');
      if (normalizedExtLink) {
        const titleAndLinkKey = `${normalizedTitle}::${normalizedExtLink}`;
        if (!groupedByTitleAndExternalLink.has(titleAndLinkKey)) {
          groupedByTitleAndExternalLink.set(titleAndLinkKey, []);
        }
        groupedByTitleAndExternalLink.get(titleAndLinkKey)!.push(resource);
      }
    }
  }

  // Identifier les doublons
  const duplicates: Array<{ key: string; items: typeof resources; keep: string; remove: string[] }> = [];
  const processedIds = new Set<string>();
  
  // PRIORITÉ 1: Doublons par titre normalisé + file_url normalisé (le plus sûr)
  for (const [key, items] of groupedByTitleAndFile.entries()) {
    if (items.length > 1) {
      items.sort((a, b) => {
        if (b.downloads_count !== a.downloads_count) {
          return b.downloads_count - a.downloads_count;
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      
      const keep = items[0];
      const remove = items.slice(1).filter(item => !processedIds.has(item.id));
      
      if (remove.length > 0) {
        duplicates.push({
          key: `titre + file_url normalisé: ${key.substring(0, 60)}...`,
          items,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        items.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // PRIORITÉ 2: Doublons par titre normalisé + external_link normalisé
  for (const [key, items] of groupedByTitleAndExternalLink.entries()) {
    if (items.length > 1) {
      const unprocessedItems = items.filter(item => !processedIds.has(item.id));
      if (unprocessedItems.length > 1) {
        unprocessedItems.sort((a, b) => {
          if (b.downloads_count !== a.downloads_count) {
            return b.downloads_count - a.downloads_count;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        const keep = unprocessedItems[0];
        const remove = unprocessedItems.slice(1);
        
        duplicates.push({
          key: `titre + external_link normalisé: ${key.substring(0, 60)}...`,
          items: unprocessedItems,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        unprocessedItems.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par file_url exact
  for (const [url, items] of groupedByFileUrl.entries()) {
    if (items.length > 1) {
      items.sort((a, b) => {
        // Prioriser celui avec le plus de téléchargements, puis le plus ancien
        if (b.downloads_count !== a.downloads_count) {
          return b.downloads_count - a.downloads_count;
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      
      const keep = items[0];
      const remove = items.slice(1).filter(item => !processedIds.has(item.id));
      
      if (remove.length > 0) {
        duplicates.push({
          key: `file_url exact: ${url.substring(0, 60)}...`,
          items,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        items.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par file_url normalisé (détecte les URLs avec paramètres différents)
  for (const [normalizedUrl, items] of groupedByNormalizedFileUrl.entries()) {
    if (items.length > 1) {
      // Filtrer ceux déjà traités
      const unprocessedItems = items.filter(item => !processedIds.has(item.id));
      if (unprocessedItems.length > 1) {
        unprocessedItems.sort((a, b) => {
          if (b.downloads_count !== a.downloads_count) {
            return b.downloads_count - a.downloads_count;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        const keep = unprocessedItems[0];
        const remove = unprocessedItems.slice(1);
        
        duplicates.push({
          key: `file_url normalisé: ${normalizedUrl.substring(0, 60)}...`,
          items: unprocessedItems,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        unprocessedItems.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par external_link + title exact
  for (const [key, items] of groupedByExternalLink.entries()) {
    if (items.length > 1) {
      const unprocessedItems = items.filter(item => !processedIds.has(item.id));
      if (unprocessedItems.length > 1) {
        unprocessedItems.sort((a, b) => {
          if (b.downloads_count !== a.downloads_count) {
            return b.downloads_count - a.downloads_count;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        const keep = unprocessedItems[0];
        const remove = unprocessedItems.slice(1);
        
        duplicates.push({
          key: `external_link + title exact: ${key.substring(0, 60)}...`,
          items: unprocessedItems,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        unprocessedItems.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par external_link normalisé + titre normalisé
  for (const [normalizedKey, items] of groupedByNormalizedExternalLink.entries()) {
    if (items.length > 1) {
      const unprocessedItems = items.filter(item => !processedIds.has(item.id));
      if (unprocessedItems.length > 1) {
        unprocessedItems.sort((a, b) => {
          if (b.downloads_count !== a.downloads_count) {
            return b.downloads_count - a.downloads_count;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        const keep = unprocessedItems[0];
        const remove = unprocessedItems.slice(1);
        
        duplicates.push({
          key: `external_link + title normalisé: ${normalizedKey.substring(0, 60)}...`,
          items: unprocessedItems,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        unprocessedItems.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par titre normalisé + external_link normalisé (même titre et même lien externe)
  for (const [key, items] of groupedByTitleAndExternalLink.entries()) {
    if (items.length > 1) {
      const unprocessedItems = items.filter(item => !processedIds.has(item.id));
      if (unprocessedItems.length > 1) {
        unprocessedItems.sort((a, b) => {
          if (b.downloads_count !== a.downloads_count) {
            return b.downloads_count - a.downloads_count;
          }
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
        
        const keep = unprocessedItems[0];
        const remove = unprocessedItems.slice(1);
        
        duplicates.push({
          key: `titre + external_link normalisé: ${key.substring(0, 60)}...`,
          items: unprocessedItems,
          keep: keep.id,
          remove: remove.map(item => item.id),
        });
        unprocessedItems.forEach(item => processedIds.add(item.id));
      }
    }
  }
  
  // Doublons par titre normalisé (même titre, même type, même file_url ou external_link)
  for (const [normalizedTitle, items] of groupedByTitle.entries()) {
    if (items.length > 1) {
      // Grouper aussi par type pour éviter de supprimer des ressources différentes
      const byType = new Map<string, typeof resources>();
      for (const item of items) {
        const type = item.type || 'other';
        if (!byType.has(type)) {
          byType.set(type, []);
        }
        byType.get(type)!.push(item);
      }
      
      for (const [type, typeItems] of byType.entries()) {
        if (typeItems.length > 1) {
          const unprocessedItems = typeItems.filter(item => !processedIds.has(item.id));
          if (unprocessedItems.length > 1) {
            // Vérifier qu'ils ont le même file_url ou external_link normalisé
            const first = unprocessedItems[0];
            const firstUrl = normalizeUrl(first.file_url || first.external_link || '');
            const sameUrl = unprocessedItems.every(item => {
              const itemUrl = normalizeUrl(item.file_url || item.external_link || '');
              return firstUrl && itemUrl && firstUrl === itemUrl;
            });
            
            if (sameUrl && firstUrl) {
              unprocessedItems.sort((a, b) => {
                if (b.downloads_count !== a.downloads_count) {
                  return b.downloads_count - a.downloads_count;
                }
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
              });
              
              const keep = unprocessedItems[0];
              const remove = unprocessedItems.slice(1);
              
              duplicates.push({
                key: `titre normalisé + type (${type}) + URL: ${normalizedTitle.substring(0, 40)}...`,
                items: unprocessedItems,
                keep: keep.id,
                remove: remove.map(item => item.id),
              });
              unprocessedItems.forEach(item => processedIds.add(item.id));
            }
          }
        }
      }
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ Aucun doublon trouvé');
    return;
  }

  console.log(`⚠️  ${duplicates.length} groupes de doublons trouvés\n`);

  let totalRemoved = 0;
  let totalKept = 0;

  // Supprimer les doublons
  for (const duplicate of duplicates) {
    const keepItem = duplicate.items[0];
    console.log(`📋 Doublons pour: ${keepItem.title}`);
    console.log(`   ${duplicate.key}`);
    console.log(`   ✅ Garde: ${keepItem.id} (créé le ${new Date(keepItem.created_at).toLocaleDateString()}, ${keepItem.downloads_count} téléchargements)`);
    
    for (const removeId of duplicate.remove) {
      const removeItem = duplicate.items.find(item => item.id === removeId);
      console.log(`   ❌ Supprime: ${removeId} (créé le ${removeItem ? new Date(removeItem.created_at).toLocaleDateString() : 'N/A'}, ${removeItem?.downloads_count || 0} téléchargements)`);
      
      if (dryRun) {
        console.log(`   🔍 [DRY-RUN] Serait supprimé: ${removeId}`);
        totalRemoved++;
      } else {
        const { error: deleteError } = await newClient
          .from('resources')
          .delete()
          .eq('id', removeId);

        if (deleteError) {
          console.error(`   ❌ Erreur suppression ${removeId}: ${deleteError.message}`);
        } else {
          totalRemoved++;
        }
      }
    }
    
    totalKept++;
    console.log('');
  }

  console.log(`\n✅ Nettoyage terminé:`);
  console.log(`   ✅ ${totalKept} ressources conservées`);
  console.log(`   🗑️  ${totalRemoved} doublons supprimés`);
}

async function clean() {
  console.log('🧹 Début du nettoyage des doublons...\n');
  
  await cleanWallpaperDuplicates();
  console.log('\n');
  await cleanResourceDuplicates();
  
  console.log('\n✅ Nettoyage complet terminé');
}

// Lancer le nettoyage
clean().catch(console.error);

