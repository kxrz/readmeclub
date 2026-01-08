/**
 * Script de pré-génération des images OpenGraph au build time
 * 
 * Ce script génère toutes les images OG pour :
 * - Les wallpapers (croppées depuis l'image réelle)
 * - Les ressources (depuis thumbnail_url ou générées)
 * 
 * Usage:
 *   npm run generate-og-images
 *   ou
 *   tsx scripts/generate-og-images.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { loadAllWallpapers } from '../src/lib/utils/wallpaper-loader';
import { loadAllResources } from '../src/lib/utils/resource-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Génère l'image OG pour un wallpaper
 */
async function generateWallpaperOG(wallpaper: any): Promise<boolean> {
  try {
    const imagePath = wallpaper.webp_path || wallpaper.thumbnail_path;
    if (!imagePath) {
      console.warn(`⚠️  Pas d'image pour wallpaper ${wallpaper.id}`);
      return false;
    }

    const fullImagePath = path.join(projectRoot, 'public', imagePath);
    
    // Vérifier si le fichier existe
    try {
      await fs.access(fullImagePath);
    } catch {
      console.warn(`⚠️  Fichier image non trouvé: ${fullImagePath}`);
      return false;
    }

    // Créer le dossier de destination
    const ogDir = path.join(projectRoot, 'public', 'og-images', 'wallpapers');
    await fs.mkdir(ogDir, { recursive: true });
    
    const ogImagePath = path.join(ogDir, `${wallpaper.id}.png`);

    // Charger et cropper l'image au format OG
    const imageBuffer = await fs.readFile(fullImagePath);
    await sharp(imageBuffer)
      .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .png()
      .toFile(ogImagePath);

    console.log(`✅ OG image générée: wallpapers/${wallpaper.id}.png`);
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur pour wallpaper ${wallpaper.id}:`, error.message);
    return false;
  }
}

/**
 * Génère l'image OG pour une ressource (si c'est une image)
 */
async function generateResourceOG(resource: any): Promise<boolean> {
  try {
    // Si la ressource a un thumbnail_url, on peut le copier/cropper
    if (resource.thumbnail_url) {
      const thumbnailPath = resource.thumbnail_url.startsWith('/')
        ? path.join(projectRoot, 'public', resource.thumbnail_url)
        : path.join(projectRoot, 'public', resource.thumbnail_url);

      try {
        await fs.access(thumbnailPath);
        
        const ogDir = path.join(projectRoot, 'public', 'og-images', 'resources');
        await fs.mkdir(ogDir, { recursive: true });
        
        const ogImagePath = path.join(ogDir, `${resource.id}.png`);

        const imageBuffer = await fs.readFile(thumbnailPath);
        await sharp(imageBuffer)
          .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, {
            fit: 'cover',
            position: 'center',
          })
          .png()
          .toFile(ogImagePath);

        console.log(`✅ OG image générée: resources/${resource.id}.png`);
        return true;
      } catch {
        // Thumbnail non trouvé, on skip
        return false;
      }
    }

    // Si c'est une image à télécharger, on peut aussi la traiter
    const isImageFile = resource.file_url && resource.file_name 
      ? /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(resource.file_name)
      : false;

    if (isImageFile && resource.file_url) {
      // Note: Les images dans Supabase Storage nécessiteraient un téléchargement
      // Pour l'instant, on skip ces cas
      return false;
    }

    return false;
  } catch (error: any) {
    console.error(`❌ Erreur pour resource ${resource.id}:`, error.message);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Début de la génération des images OpenGraph...\n');

  // Créer les dossiers de destination
  const ogWallpapersDir = path.join(projectRoot, 'public', 'og-images', 'wallpapers');
  const ogResourcesDir = path.join(projectRoot, 'public', 'og-images', 'resources');
  await fs.mkdir(ogWallpapersDir, { recursive: true });
  await fs.mkdir(ogResourcesDir, { recursive: true });

  // Générer les images OG pour les wallpapers
  console.log('📸 Génération des images OG pour les wallpapers...');
  const wallpapers = await loadAllWallpapers();
  let wallpaperSuccess = 0;
  let wallpaperFailed = 0;

  for (const wallpaper of wallpapers) {
    const success = await generateWallpaperOG(wallpaper);
    if (success) {
      wallpaperSuccess++;
    } else {
      wallpaperFailed++;
    }
  }

  console.log(`\n✅ Wallpapers: ${wallpaperSuccess} générées, ${wallpaperFailed} échouées\n`);

  // Générer les images OG pour les ressources (seulement celles avec thumbnail)
  console.log('📦 Génération des images OG pour les ressources...');
  const resources = await loadAllResources();
  const resourcesWithThumbnail = resources.filter(r => r.thumbnail_url);
  let resourceSuccess = 0;
  let resourceFailed = 0;

  for (const resource of resourcesWithThumbnail) {
    const success = await generateResourceOG(resource);
    if (success) {
      resourceSuccess++;
    } else {
      resourceFailed++;
    }
  }

  console.log(`\n✅ Ressources: ${resourceSuccess} générées, ${resourceFailed} échouées\n`);

  console.log('✨ Génération terminée !');
}

main().catch(console.error);
