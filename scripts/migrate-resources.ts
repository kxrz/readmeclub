/**
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
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || '';

// Debug: afficher les variables chargées (masquer les valeurs sensibles)
console.log('📋 Variables d\'environnement:');
console.log(`   Airtable API Key: ${AIRTABLE_API_KEY ? '✅ configurée (' + AIRTABLE_API_KEY.substring(0, 8) + '...)' : '❌ manquante'}`);
console.log(`   Airtable Base ID: ${AIRTABLE_BASE_ID ? `✅ ${AIRTABLE_BASE_ID}` : '❌ manquante'}`);
console.log(`   Airtable Table: ${AIRTABLE_TABLE_NAME ? `✅ ${AIRTABLE_TABLE_NAME}` : '❌ manquante'}`);
console.log('');

if (!OLD_SUPABASE_URL || !OLD_SUPABASE_KEY) {
  console.error('❌ Veuillez configurer OLD_PUBLIC_SUPABASE_URL et OLD_PUBLIC_SUPABASE_ANON_KEY dans .env');
  process.exit(1);
}

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_KEY) {
  console.error('❌ Veuillez configurer PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env');
  process.exit(1);
}

const oldClient = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const oldClientAdmin = OLD_SUPABASE_SERVICE_KEY 
  ? createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY)
  : null;
const newClient = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

// Mapping des types si nécessaire
const typeMapping: Record<string, string> = {
  // Ajouter les mappings ici si les types ont changé
};

async function testAirtableConnection(): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    console.warn('⚠️  Variables Airtable non configurées');
    return false;
  }

  try {
    // Test simple : récupérer les premiers enregistrements
    const testUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=1`;
    
    const response = await fetch(testUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur connexion Airtable (status ${response.status}):`);
      console.error(`   ${errorText}`);
      if (response.status === 401) {
        console.error(`   Vérifiez votre AIRTABLE_API_KEY`);
      } else if (response.status === 404) {
        console.error(`   Base ID ou Table Name incorrect`);
        console.error(`   Base ID: ${AIRTABLE_BASE_ID}`);
        console.error(`   Table: ${AIRTABLE_TABLE_NAME}`);
      }
      return false;
    }

    const data = await response.json();
    console.log(`✅ Connexion Airtable OK`);
    console.log(`   Nombre d'enregistrements dans la table: ${data.records?.length || 0}`);
    if (data.records && data.records.length > 0) {
      console.log(`   Champs disponibles: ${Object.keys(data.records[0].fields).join(', ')}`);
    }
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur test connexion Airtable: ${error.message}`);
    return false;
  }
}

async function findAirtableRecord(title: string): Promise<any | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
    return null;
  }

  try {
    // Rechercher l'enregistrement par titre (essayer plusieurs variantes du nom du champ)
    const titleFields = ['Title', 'title', 'Name', 'name'];
    
    for (const fieldName of titleFields) {
      // Échapper les guillemets et caractères spéciaux dans le titre
      const escapedTitle = title.replace(/"/g, '\\"').replace(/'/g, "\\'");
      const searchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=${encodeURIComponent(`{${fieldName}}="${escapedTitle}"`)}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Table ou base introuvable
          console.warn(`⚠️  Table Airtable introuvable (${AIRTABLE_TABLE_NAME})`);
          return null;
        }
        const errorText = await response.text();
        console.warn(`⚠️  Erreur recherche Airtable (status ${response.status}) pour "${title}": ${errorText.substring(0, 200)}`);
        continue; // Essayer le champ suivant
      }

      const data = await response.json();
      if (data.records && data.records.length > 0) {
        console.log(`   ✅ Enregistrement trouvé dans Airtable avec le champ "${fieldName}"`);
        return data.records[0];
      }
    }

    // Si pas trouvé avec les filtres, essayer une recherche partielle
    console.warn(`⚠️  Enregistrement non trouvé avec recherche exacte pour: "${title}"`);
    console.warn(`   Tentative de recherche partielle...`);
    
    // Recherche partielle (contient le titre)
    const partialSearchUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=10`;
    const response = await fetch(partialSearchUrl, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Chercher manuellement dans les résultats
      for (const record of data.records || []) {
        for (const [fieldName, fieldValue] of Object.entries(record.fields)) {
          if (typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(title.toLowerCase())) {
            console.log(`   ✅ Enregistrement trouvé avec correspondance partielle dans "${fieldName}"`);
            return record;
          }
        }
      }
    }

    return null;
  } catch (error: any) {
    console.error(`❌ Erreur lors de la recherche Airtable: ${error.message}`);
    return null;
  }
}

async function downloadFileFromAirtable(attachment: any): Promise<Buffer | null> {
  if (!attachment || !attachment.url) {
    return null;
  }

  try {
    const fileResponse = await fetch(attachment.url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!fileResponse.ok) {
      console.warn(`⚠️  Impossible de télécharger depuis Airtable (status ${fileResponse.status})`);
      return null;
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    console.error(`❌ Erreur téléchargement Airtable: ${error.message}`);
    return null;
  }
}

async function checkFileExistsInStorage(bucket: string, fileName: string): Promise<string | null> {
  try {
    // Vérifier si le fichier existe déjà dans le bucket
    try {
      const { data: fileData, error: checkError } = await newClient.storage
        .from(bucket)
        .download(fileName);
      
      if (!checkError && fileData) {
        const { data: { publicUrl } } = newClient.storage
          .from(bucket)
          .getPublicUrl(fileName);
        return publicUrl;
      }
    } catch (e) {
      // Fichier n'existe pas, continuer
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function downloadAndUploadAsset(url: string, bucket: string, fileName: string, resource?: any): Promise<string | null> {
  try {
    // Vérifier d'abord si le fichier existe déjà dans Supabase Storage
    const existingUrl = await checkFileExistsInStorage(bucket, fileName);
    if (existingUrl) {
      console.log(`   ✅ Fichier déjà présent dans Supabase Storage, réutilisation`);
      return existingUrl;
    }

    // Si c'est une URL Airtable, essayer de récupérer via l'API Airtable
    if (url.includes('airtableusercontent.com') && AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME && resource?.title) {
      console.log(`📥 Tentative de récupération depuis Airtable API pour: ${resource.title}...`);
      
      // Rechercher l'enregistrement Airtable correspondant
      const airtableRecord = await findAirtableRecord(resource.title);
      
      if (airtableRecord) {
        // Chercher le champ d'attachement (peut être 'file', 'File', 'attachment', etc.)
        const attachmentFields = ['file', 'File', 'attachment', 'Attachment', 'file_url', 'File URL'];
        let attachment = null;
        
        for (const fieldName of attachmentFields) {
          const field = airtableRecord.fields[fieldName];
          if (field && Array.isArray(field) && field.length > 0 && field[0].url) {
            attachment = field[0];
            break;
          }
        }
        
        // Si pas trouvé, chercher dans tous les champs
        if (!attachment) {
          for (const [, fieldValue] of Object.entries(airtableRecord.fields)) {
            if (Array.isArray(fieldValue) && fieldValue.length > 0 && (fieldValue[0] as any).url) {
              attachment = fieldValue[0];
              break;
            }
          }
        }
        
        if (attachment) {
          // Vérifier si le fichier existe déjà avant de télécharger depuis Airtable
          const attachmentFileName = attachment.filename || resource?.file_name || fileName.split('/').pop() || 'file';
          const checkFileName = `migrated/${attachmentFileName}`;
          const existingAirtableUrl = await checkFileExistsInStorage(bucket, checkFileName);
          
          if (existingAirtableUrl) {
            console.log(`   ✅ Fichier Airtable déjà présent dans Storage (${attachmentFileName}), réutilisation`);
            return existingAirtableUrl;
          }

          const buffer = await downloadFileFromAirtable(attachment);
          if (buffer) {
            console.log(`✅ Fichier récupéré depuis Airtable API`);
            
            // Détecter le content-type
            const fileExtension = attachment.filename?.split('.').pop()?.toLowerCase() || 
                                 resource?.file_name?.split('.').pop()?.toLowerCase() || 
                                 fileName.split('.').pop()?.toLowerCase() || 'bin';
            const mimeTypes: Record<string, string> = {
              'pdf': 'application/pdf',
              'png': 'image/png',
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'gif': 'image/gif',
              'svg': 'image/svg+xml',
              'bin': 'application/octet-stream',
              'zip': 'application/zip',
              'bmp': 'image/bmp',
            };
            const contentType = mimeTypes[fileExtension] || attachment.type || 'application/octet-stream';

            // Upload vers Supabase Storage
            const { data: uploadData, error: uploadError } = await newClient.storage
              .from(bucket)
              .upload(fileName, buffer, {
                contentType,
                upsert: false, // Ne pas écraser si existe déjà
              });

            if (!uploadError) {
              const { data: { publicUrl } } = newClient.storage
                .from(bucket)
                .getPublicUrl(uploadData.path);
              return publicUrl;
            } else {
              // Si erreur car fichier existe déjà, récupérer l'URL existante
              if (uploadError.message.includes('already exists') || uploadError.message.includes('duplicate') || uploadError.message.includes('The resource already exists')) {
                console.log(`   ⚠️  Fichier existe déjà, récupération de l'URL existante`);
                const existingUrl = await checkFileExistsInStorage(bucket, fileName);
                if (existingUrl) {
                  return existingUrl;
                }
              }
              console.error(`❌ Erreur upload vers Supabase: ${uploadError.message}`);
            }
          }
        } else {
          console.warn(`⚠️  Aucun fichier attaché trouvé dans l'enregistrement Airtable pour: ${resource.title}`);
          console.warn(`   Champs disponibles: ${airtableRecord ? Object.keys(airtableRecord.fields).join(', ') : 'N/A'}`);
        }
      } else {
        console.warn(`⚠️  Enregistrement Airtable non trouvé pour: ${resource.title}`);
        console.warn(`   Vérifiez que le titre correspond exactement dans Airtable`);
      }
      
      // Si l'API Airtable n'a pas fonctionné, essayer depuis l'ancien Supabase Storage
          if (oldClientAdmin) {
            console.log(`   Tentative de récupération depuis l'ancien Supabase Storage...`);
            const fileNameFromUrl = resource?.file_name || fileName.split('/').pop() || 'file';
            const buckets = ['resources', 'files', 'uploads'];
            for (const bucketName of buckets) {
              try {
                const { data: fileData, error: downloadError } = await oldClientAdmin!.storage
              .from(bucketName)
              .download(fileNameFromUrl);
            
            if (!downloadError && fileData) {
              console.log(`✅ Fichier trouvé dans l'ancien Supabase Storage (bucket: ${bucketName})`);
              
              // Vérifier si le fichier existe déjà dans le nouveau Supabase
              const existingOldUrl = await checkFileExistsInStorage(bucket, fileName);
              if (existingOldUrl) {
                console.log(`   ✅ Fichier déjà présent dans le nouveau Supabase Storage, réutilisation`);
                return existingOldUrl;
              }

              const arrayBuffer = await fileData.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              
              const { data: uploadData, error: uploadError } = await newClient.storage
                .from(bucket)
                .upload(fileName, buffer, {
                  contentType: fileData.type || 'application/octet-stream',
                  upsert: false,
                });
              
              if (!uploadError) {
                const { data: { publicUrl } } = newClient.storage
                  .from(bucket)
                  .getPublicUrl(uploadData.path);
                return publicUrl;
              } else if (uploadError.message.includes('already exists') || uploadError.message.includes('duplicate') || uploadError.message.includes('The resource already exists')) {
                console.log(`   ⚠️  Fichier existe déjà, récupération de l'URL existante`);
                const existingUrl = await checkFileExistsInStorage(bucket, fileName);
                if (existingUrl) {
                  return existingUrl;
                }
              }
            }
          } catch (e) {
            // Continuer avec le bucket suivant
          }
        }
      }
    }
    
    // Télécharger l'asset directement depuis l'URL (fallback)
    const headers: HeadersInit = {};
    
    if (url.includes('airtableusercontent.com')) {
      headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
      headers['Referer'] = 'https://airtable.com/';
      if (AIRTABLE_API_KEY) {
        headers['Authorization'] = `Bearer ${AIRTABLE_API_KEY}`;
      }
    }
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
      if (response.status === 410) {
        console.warn(`⚠️  URL Airtable expirée (410 Gone): ${resource?.title || fileName}`);
        if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME) {
          console.warn(`   Tentative de récupération via API Airtable...`);
        }
      } else {
        console.warn(`⚠️  Impossible de télécharger (status ${response.status}): ${url.substring(0, 80)}...`);
      }
      return null;
    }

    // Vérifier si le fichier existe déjà avant de télécharger
    const existingDirectUrl = await checkFileExistsInStorage(bucket, fileName);
    if (existingDirectUrl) {
      console.log(`   ✅ Fichier déjà présent dans Storage, réutilisation`);
      return existingDirectUrl;
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Détecter le content-type si non fourni
    let contentType = blob.type || 'application/octet-stream';
    if (contentType === 'application/octet-stream' || !contentType) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'bin': 'application/octet-stream',
        'zip': 'application/zip',
        'bmp': 'image/bmp',
      };
      contentType = mimeTypes[extension || ''] || contentType;
    }

    // Upload vers Supabase Storage
    const { data, error } = await newClient.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      // Si erreur car fichier existe déjà, récupérer l'URL existante
      if (error.message.includes('already exists') || error.message.includes('duplicate') || error.message.includes('The resource already exists')) {
        console.log(`   ⚠️  Fichier existe déjà, récupération de l'URL existante`);
        const existingUrl = await checkFileExistsInStorage(bucket, fileName);
        if (existingUrl) {
          return existingUrl;
        }
      }
      console.error(`❌ Erreur upload: ${error.message}`);
      return null;
    }

    // Récupérer l'URL publique
    const { data: { publicUrl } } = newClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error(`❌ Erreur lors du téléchargement/upload: ${error.message}`);
    return null;
  }
}

async function migrateResource(resource: any) {
  try {
    // Mapper le type si nécessaire
    const mappedType = typeMapping[resource.type] || resource.type;

    // Préparer les données
    const newResource: any = {
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
      const isAirtable = resource.file_url.includes('airtableusercontent.com');
      const isOldSupabase = OLD_SUPABASE_URL && resource.file_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '');
      const isExternal = !resource.file_url.includes('supabase.co') || isOldSupabase || isAirtable;
      
      if (isExternal) {
        // Asset externe, Airtable ou de l'ancien Supabase - télécharger et uploader
        console.log(`📥 Téléchargement: ${resource.title}...`);
        const fileExtension = resource.file_name?.split('.').pop() || 'bin';
        const fileName = `migrated/${Date.now()}-${resource.id}.${fileExtension}`;
        const newUrl = await downloadAndUploadAsset(
          resource.file_url,
          'resources',
          fileName,
          resource
        );
        if (newUrl) {
          newResource.file_url = newUrl;
          newResource.file_name = resource.file_name || 'migrated-file';
          console.log(`✅ Upload réussi: ${resource.title}`);
        } else {
          // Si c'est une URL Airtable expirée, ne pas garder l'URL
          if (isAirtable) {
            console.warn(`⚠️  URL Airtable expirée pour: ${resource.title}`);
            console.warn(`   La ressource sera créée sans fichier. Vous pourrez uploader manuellement plus tard.`);
            // Ne pas inclure file_url si c'est une URL Airtable expirée
            // La ressource sera créée avec seulement les métadonnées et external_link si disponible
          } else {
            // Pour les autres cas, garder l'URL originale
            console.warn(`⚠️  Échec upload pour: ${resource.title}, conservation de l'URL originale`);
            newResource.file_url = resource.file_url;
            newResource.file_name = resource.file_name;
          }
        }
      } else {
        // Déjà dans le nouveau Supabase - garder tel quel
        newResource.file_url = resource.file_url;
        newResource.file_name = resource.file_name;
      }
    }

    // Gérer les thumbnails externes
    if (resource.thumbnail_url) {
      const isAirtable = resource.thumbnail_url.includes('airtableusercontent.com');
      const isOldSupabase = OLD_SUPABASE_URL && resource.thumbnail_url.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '');
      const isExternal = !resource.thumbnail_url.includes('supabase.co') || isOldSupabase || isAirtable;
      
      if (isExternal) {
        // Thumbnail externe, Airtable ou de l'ancien Supabase - télécharger et uploader
        const fileExtension = resource.thumbnail_url.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `migrated/${Date.now()}-${resource.id}-thumb.${fileExtension}`;
        const newUrl = await downloadAndUploadAsset(
          resource.thumbnail_url,
          'resources',
          fileName,
          resource
        );
        if (newUrl) {
          newResource.thumbnail_url = newUrl;
        }
      } else {
        // Déjà dans le nouveau Supabase - garder tel quel
        newResource.thumbnail_url = resource.thumbnail_url;
      }
    }

    // Vérifier qu'on a au moins un file_url ou external_link pour créer la ressource
    if (!newResource.file_url && !newResource.external_link) {
      console.warn(`⚠️  Ressource ${resource.title} ignorée: pas de fichier ni de lien externe disponible`);
      return false;
    }

    // Vérifier si la ressource existe déjà (éviter les doublons)
    let existingResource = null;
    if (newResource.file_url) {
      const { data: existing } = await newClient
        .from('resources')
        .select('id, title, file_url')
        .eq('file_url', newResource.file_url)
        .maybeSingle();
      existingResource = existing;
    } else if (newResource.external_link) {
      const { data: existing } = await newClient
        .from('resources')
        .select('id, title, external_link')
        .eq('external_link', newResource.external_link)
        .eq('title', newResource.title)
        .maybeSingle();
      existingResource = existing;
    }

    if (existingResource) {
      console.log(`⏭️  Ressource déjà existante (ID: ${existingResource.id}): ${resource.title}`);
      return true; // Considéré comme succès car déjà migré
    }

    // Insérer dans le nouveau Supabase
    const { error } = await newClient
      .from('resources')
      .insert(newResource)
      .select()
      .single();

    if (error) {
      console.error(`❌ Erreur migration ${resource.title}: ${error.message}`);
      return false;
    }

    // Message informatif sur le statut du fichier
    const fileStatus = newResource.file_url 
      ? 'avec fichier' 
      : (resource.file_url?.includes('airtableusercontent.com') 
          ? 'sans fichier (URL Airtable expirée)' 
          : 'sans fichier');
    console.log(`✅ Migré: ${resource.title} (${fileStatus})`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur migration ${resource.title}: ${error}`);
    return false;
  }
}

async function migrateWallpaper(wallpaper: any) {
  try {
    // Préparer les données selon le schéma wallpapers
    const newWallpaper: any = {
      status: wallpaper.status || 'published',
      title: wallpaper.title,
      category: wallpaper.category || 'other',
      author_name: wallpaper.author_name,
      reddit_username: wallpaper.reddit_username,
      instagram_username: wallpaper.instagram_username,
      file_name: wallpaper.file_name || 'wallpaper.jpg',
      file_size: wallpaper.file_size || 0,
      width: wallpaper.width || 0,
      height: wallpaper.height || 0,
      download_count: wallpaper.download_count || wallpaper.downloads_count || 0,
      flags_count: wallpaper.flags_count || 0,
      hidden: wallpaper.hidden || false,
      submitted_ip_hash: wallpaper.submitted_ip_hash || 'migrated', // Valeur par défaut pour les migrations
    };

    // Gérer l'image du wallpaper (file_url dans le schéma)
    if (wallpaper.file_url) {
      const isAirtable = wallpaper.file_url?.includes('airtableusercontent.com') || false;
      const isOldSupabase = OLD_SUPABASE_URL && wallpaper.file_url?.includes(OLD_SUPABASE_URL.split('//')[1]?.split('.')[0] || '') || false;
      const isExternal = !wallpaper.file_url?.includes('supabase.co') || isOldSupabase || isAirtable;
      
      if (isExternal) {
        console.log(`📥 Téléchargement wallpaper: ${wallpaper.title || wallpaper.id}...`);
        const fileExtension = wallpaper.file_name?.split('.').pop() || wallpaper.file_url.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `migrated/wallpapers/${Date.now()}-${wallpaper.id}.${fileExtension}`;
        const newUrl = await downloadAndUploadAsset(
          wallpaper.file_url,
          'wallpapers',
          fileName,
          wallpaper
        );
        if (newUrl) {
          newWallpaper.file_url = newUrl;
          // Mettre à jour le file_name si nécessaire
          if (wallpaper.file_name) {
            newWallpaper.file_name = wallpaper.file_name;
          }
          console.log(`✅ Upload réussi: ${wallpaper.title || wallpaper.id}`);
        } else {
          if (isAirtable) {
            console.warn(`⚠️  URL Airtable expirée pour: ${wallpaper.title || wallpaper.id}`);
            console.warn(`   Le wallpaper sera créé sans fichier. Vous pourrez uploader manuellement plus tard.`);
          } else {
            console.warn(`⚠️  Échec upload pour: ${wallpaper.title || wallpaper.id}, conservation de l'URL originale`);
            newWallpaper.file_url = wallpaper.file_url;
          }
        }
      } else {
        // Déjà dans le nouveau Supabase - garder tel quel
        newWallpaper.file_url = wallpaper.file_url;
      }
    }

    // Vérifier qu'on a au moins un fichier pour créer le wallpaper
    if (!newWallpaper.file_url) {
      console.warn(`⚠️  Wallpaper ${wallpaper.title || wallpaper.id} ignoré: pas de file_url disponible`);
      console.warn(`   Champs disponibles: ${Object.keys(wallpaper).join(', ')}`);
      return false;
    }

    // Vérifier si le wallpaper existe déjà (éviter les doublons)
    const { data: existingWallpaper } = await newClient
      .from('wallpapers')
      .select('id, title, file_url')
      .eq('file_url', newWallpaper.file_url)
      .maybeSingle();

    if (existingWallpaper) {
      console.log(`⏭️  Wallpaper déjà existant (ID: ${existingWallpaper.id}): ${wallpaper.title || wallpaper.id}`);
      return true; // Considéré comme succès car déjà migré
    }

    // Insérer dans le nouveau Supabase
    const { error } = await newClient
      .from('wallpapers')
      .insert(newWallpaper)
      .select()
      .single();

    if (error) {
      console.error(`❌ Erreur migration ${wallpaper.title}: ${error.message}`);
      return false;
    }

    const fileStatus = newWallpaper.file_url 
      ? 'avec fichier' 
      : (wallpaper.file_url?.includes('airtableusercontent.com') 
          ? 'sans fichier (URL Airtable expirée)' 
          : 'sans fichier');
    console.log(`✅ Migré: ${wallpaper.title || wallpaper.id} (${fileStatus})`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur migration ${wallpaper.title}: ${error}`);
    return false;
  }
}

async function migrate() {
  console.log('🚀 Début de la migration...\n');

  // Tester la connexion Airtable si configurée
  if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME) {
    console.log('🔍 Test de la connexion Airtable...\n');
    await testAirtableConnection();
    console.log('');
  } else {
    console.log('⚠️  Airtable non configuré - les fichiers seront récupérés depuis l\'ancien Supabase uniquement\n');
  }

  // Récupérer toutes les ressources
  const { data: resources, error: resourcesError } = await oldClient
    .from('resources')
    .select('*');

  if (resourcesError) {
    console.error('❌ Erreur récupération ressources:', resourcesError);
    process.exit(1);
  }

  // Récupérer tous les wallpapers
  const { data: wallpapers, error: wallpapersError } = await oldClient
    .from('wallpapers')
    .select('*');

  if (wallpapersError) {
    console.warn('⚠️  Erreur récupération wallpapers:', wallpapersError);
    console.warn('   Continuons avec les ressources uniquement...\n');
  }

  const totalResources = resources?.length || 0;
  const totalWallpapers = wallpapers?.length || 0;

  if (totalResources === 0 && totalWallpapers === 0) {
    console.log('ℹ️  Aucune ressource ni wallpaper à migrer');
    return;
  }

  console.log(`📦 ${totalResources} ressources à migrer`);
  if (totalWallpapers > 0) {
    console.log(`🖼️  ${totalWallpapers} wallpapers à migrer`);
  }
  console.log('');

  let resourcesSuccess = 0;
  let resourcesFailed = 0;
  let wallpapersSuccess = 0;
  let wallpapersFailed = 0;

  // Migrer chaque ressource
  if (resources && resources.length > 0) {
    console.log('📚 Migration des ressources...\n');
    for (const resource of resources) {
      const result = await migrateResource(resource);
      if (result) {
        resourcesSuccess++;
      } else {
        resourcesFailed++;
      }

      // Pause pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Migrer chaque wallpaper
  if (wallpapers && wallpapers.length > 0) {
    console.log('\n🖼️  Migration des wallpapers...\n');
    for (const wallpaper of wallpapers) {
      const result = await migrateWallpaper(wallpaper);
      if (result) {
        wallpapersSuccess++;
      } else {
        wallpapersFailed++;
      }

      // Pause pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`\n✅ Migration terminée:`);
  console.log(`   📚 Ressources: ${resourcesSuccess} réussies, ${resourcesFailed} échouées`);
  if (totalWallpapers > 0) {
    console.log(`   🖼️  Wallpapers: ${wallpapersSuccess} réussis, ${wallpapersFailed} échoués`);
  }
}

// Lancer la migration
migrate().catch(console.error);
