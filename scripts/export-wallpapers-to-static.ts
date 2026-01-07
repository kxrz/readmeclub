/**
 * Script d'export des Wallpapers depuis Supabase vers fichiers statiques
 * 
 * Ce script :
 * 1. Récupère les wallpapers publiés non encore exportés (exported_to_static = false)
 * 2. Télécharge les images depuis Supabase Storage
 * 3. Convertit en WebP pour le front (optimisé)
 * 4. Crée une vignette (thumbnail) en WebP
 * 5. Conserve l'original dans le dossier
 * 6. Crée un fichier JSON index avec toutes les métadonnées
 * 7. Marque les wallpapers comme exportés (exported_to_static = true)
 * 
 * Usage:
 *   npm run export-wallpapers
 *   ou
 *   tsx scripts/export-wallpapers-to-static.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import { createWriteStream } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

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

/**
 * Système de logging dédié pour l'export des wallpapers
 */
const logDir = path.join(projectRoot, 'public', 'wallpapers');
const logFile = path.join(logDir, 'export-errors.log');

interface LogEntry {
  timestamp: string;
  wallpaperId: string;
  wallpaperTitle?: string;
  step: string;
  error: string;
  details?: any;
}

async function writeLog(entry: LogEntry): Promise<void> {
  try {
    await fs.mkdir(logDir, { recursive: true });
    const logLine = JSON.stringify(entry) + '\n';
    await fs.appendFile(logFile, logLine, 'utf-8');
  } catch (error) {
    console.error(`❌ Impossible d'écrire dans le log: ${error}`);
  }
}

async function clearLog(): Promise<void> {
  try {
    await fs.writeFile(logFile, '', 'utf-8');
    console.log(`📝 Log vidé: ${logFile}`);
  } catch (error) {
    // Ignorer si le fichier n'existe pas
  }
}

interface WallpaperData {
  id: string;
  title?: string;
  category?: string;
  author_name?: string;
  reddit_username?: string;
  instagram_username?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  width: number;
  height: number;
  download_count: number;
  created_at: string;
}

interface WallpaperMetadata {
  id: string;
  title?: string;
  category?: string;
  author_name?: string;
  reddit_username?: string;
  instagram_username?: string;
  width: number;
  height: number;
  file_size: number;
  download_count: number;
  created_at: string;
  webp_path: string;
  thumbnail_path: string;
  original_path: string;
}

/**
 * Télécharge une image depuis Supabase Storage
 */
async function downloadImage(
  supabase: any,
  imageUrl: string,
  destinationPath: string,
  wallpaperId?: string,
  wallpaperTitle?: string
): Promise<Buffer | null> {
  try {
    if (imageUrl.includes('supabase.co/storage')) {
      // Extraire le chemin depuis l'URL Supabase Storage
      const urlParts = imageUrl.split('/storage/v1/object/public/');
      if (urlParts.length === 2) {
        const [bucket, ...filePathParts] = urlParts[1].split('/');
        const filePath = filePathParts.join('/');
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .download(filePath);
        
        if (error) {
          const errorMsg = `Erreur téléchargement depuis Supabase Storage: ${error.message}`;
          console.error(`❌ ${errorMsg} pour ${imageUrl}`);
          if (wallpaperId) {
            await writeLog({
              timestamp: new Date().toISOString(),
              wallpaperId,
              wallpaperTitle,
              step: 'downloadImage',
              error: errorMsg,
              details: { imageUrl, bucket, filePath, supabaseError: error },
            });
          }
          return null;
        }
        
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Vérifier la signature du fichier téléchargé
        const signature = buffer.slice(0, 4).toString('hex');
        if (wallpaperId) {
          await writeLog({
            timestamp: new Date().toISOString(),
            wallpaperId,
            wallpaperTitle,
            step: 'downloadImage-success',
            error: 'none',
            details: {
              imageUrl,
              bufferSize: buffer.length,
              signatureHex: signature,
              signatureAscii: buffer.slice(0, 10).toString('ascii'),
            },
          });
        }
        
        return buffer;
      }
    } else {
      // URL externe
      const response = await fetch(imageUrl);
      if (!response.ok) {
        const errorMsg = `Impossible de télécharger depuis URL externe: ${response.statusText}`;
        console.error(`❌ ${errorMsg} pour ${imageUrl}`);
        if (wallpaperId) {
          await writeLog({
            timestamp: new Date().toISOString(),
            wallpaperId,
            wallpaperTitle,
            step: 'downloadImage-external',
            error: errorMsg,
            details: { imageUrl, status: response.status, statusText: response.statusText },
          });
        }
        return null;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    
    return null;
  } catch (error: any) {
    const errorMsg = `Erreur lors du téléchargement: ${error.message}`;
    console.error(`❌ ${errorMsg} pour ${imageUrl}`);
    if (wallpaperId) {
      await writeLog({
        timestamp: new Date().toISOString(),
        wallpaperId,
        wallpaperTitle,
        step: 'downloadImage-exception',
        error: errorMsg,
        details: { imageUrl, stack: error.stack },
      });
    }
    return null;
  }
}

/**
 * Convertit une image en WebP avec compression optimisée
 * Accepte soit un Buffer, soit un chemin de fichier (pour les BMP)
 */
async function convertToWebP(
  imageInput: Buffer | string,
  outputPath: string,
  quality: number = 75,
  maxWidth?: number,
  options?: {
    effort?: number; // 0-6, plus élevé = meilleure compression mais plus lent
    smartSubsample?: boolean; // Optimisation supplémentaire
  },
  wallpaperId?: string,
  wallpaperTitle?: string
): Promise<boolean> {
  try {
    // Vérifier d'abord si Sharp peut lire le buffer
    let pipeline: sharp.Sharp;
    try {
      pipeline = sharp(imageInput);
      // Tester en lisant les métadonnées
      const metadata = await pipeline.metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error('Métadonnées invalides (pas de width/height)');
      }
    } catch (metadataError: any) {
      const errorMsg = `Format d'image non supporté par Sharp: ${metadataError.message}`;
      console.error(`❌ ${errorMsg}`);
      if (wallpaperId) {
        const bufferInfo = typeof imageInput === 'string' 
          ? { isFilePath: true, path: imageInput }
          : { 
              isFilePath: false, 
              bufferSize: imageInput.length,
              bufferStart: imageInput.slice(0, 20).toString('hex'),
            };
        await writeLog({
          timestamp: new Date().toISOString(),
          wallpaperId,
          wallpaperTitle,
          step: 'convertToWebP-metadata',
          error: errorMsg,
          details: {
            ...bufferInfo,
            maxWidth,
            quality,
          },
        });
      }
      return false;
    }
    
    // Réinitialiser le pipeline après la lecture des métadonnées
    pipeline = sharp(imageInput);
    
    if (maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    // Essayer avec les options de compression avancées
    try {
      await pipeline
        .webp({ 
          quality: Math.max(1, Math.min(100, quality)), // S'assurer que quality est entre 1 et 100
          effort: options?.effort ?? 4, // Compression modérée (4) pour meilleur équilibre qualité/taille
          smartSubsample: options?.smartSubsample ?? true, // Optimisation supplémentaire
          nearLossless: options?.nearLossless ?? false, // Compression quasi-lossless si demandé
        })
        .toFile(outputPath);
    } catch (webpError: any) {
      // Si ça échoue, essayer avec des options plus simples
      console.log(`⚠️  Conversion WebP échouée avec options avancées (${webpError.message}), réessai avec options simples...`);
      pipeline = sharp(imageInput);
      if (maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside',
        });
      }
      try {
        await pipeline
          .webp({ quality: Math.max(1, Math.min(100, quality)) })
          .toFile(outputPath);
      } catch (simpleError: any) {
        // Si même la version simple échoue, essayer sans redimensionnement
        console.log(`⚠️  Conversion WebP simple échouée, réessai sans redimensionnement...`);
        await sharp(imageInput)
          .webp({ quality: Math.max(1, Math.min(100, quality)) })
          .toFile(outputPath);
      }
    }
    
    return true;
  } catch (error: any) {
    const errorMsg = `Erreur conversion WebP: ${error.message}`;
    console.error(`❌ ${errorMsg}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
    }
    if (wallpaperId) {
      await writeLog({
        timestamp: new Date().toISOString(),
        wallpaperId,
        wallpaperTitle,
        step: 'convertToWebP',
        error: errorMsg,
        details: {
          outputPath,
          maxWidth,
          quality,
          isFilePath: typeof imageInput === 'string',
          inputType: typeof imageInput === 'string' ? 'file' : 'buffer',
          bufferSize: typeof imageInput === 'string' ? 'N/A' : imageInput.length,
          bufferStart: typeof imageInput === 'string' ? 'N/A' : imageInput.slice(0, 20).toString('hex'),
          stack: error.stack,
        },
      });
    }
    return false;
  }
}

/**
 * Exporte un wallpaper vers fichiers statiques
 */
async function exportWallpaper(
  supabase: any,
  wallpaper: WallpaperData,
  forceRegenerate: boolean = false
): Promise<boolean> {
  try {
    console.log(`\n🖼️  Export du wallpaper: ${wallpaper.title || wallpaper.id}${forceRegenerate ? ' (régénération forcée)' : ''}`);
    
    const wallpaperDir = path.join(projectRoot, 'public', 'wallpapers', wallpaper.id);
    await fs.mkdir(wallpaperDir, { recursive: true });
    
    // Déterminer l'extension originale
    const urlParts = wallpaper.file_url.split('.');
    const originalExt = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'png';
    const originalPath = path.join(wallpaperDir, `original.${originalExt}`);
    
    // Vérifier si l'original existe déjà localement, sinon le télécharger depuis Supabase
    let originalBuffer: Buffer;
    let needsDownload = false;
    const isBMP = originalExt.toLowerCase() === 'bmp';
    
    try {
      originalBuffer = await fs.readFile(originalPath);
      console.log(`📁 Original déjà présent localement: original.${originalExt}`);
      
      // Tester si Sharp peut lire le fichier depuis le disque
      try {
        const testMetadata = await sharp(originalBuffer).metadata();
        if (!testMetadata.width || !testMetadata.height) {
          throw new Error('Métadonnées invalides');
        }
        // Sharp peut le lire, on l'utilise tel quel
        if (isBMP) {
          console.log(`✅ BMP lisible par Sharp depuis disque`);
        }
      } catch (sharpError: any) {
        // Sharp ne peut pas le lire depuis le disque
        if (isBMP) {
          // Pour les BMP, pas besoin de retélécharger - on utilisera bmp-js/pngjs pour convertir
          console.log(`⚠️  BMP non lisible par Sharp depuis disque (${sharpError.message}), utilisation du fichier local pour conversion BMP->PNG`);
          // On garde originalBuffer tel quel, pas de téléchargement
        } else {
          // Pour les autres formats, télécharger depuis Supabase (cas rare)
          console.log(`⚠️  Format non lisible par Sharp depuis disque (${sharpError.message}), téléchargement depuis Supabase...`);
          needsDownload = true;
        }
      }
    } catch {
      // Fichier n'existe pas localement, télécharger depuis Supabase
      needsDownload = true;
    }
    
    if (needsDownload) {
      // Télécharger l'image originale depuis Supabase
      const downloadedBuffer = await downloadImage(supabase, wallpaper.file_url, '', wallpaper.id, wallpaper.title);
      if (!downloadedBuffer) {
        console.error(`❌ Impossible de télécharger l'image pour ${wallpaper.id}`);
        await writeLog({
          timestamp: new Date().toISOString(),
          wallpaperId: wallpaper.id,
          wallpaperTitle: wallpaper.title,
          step: 'download-failed',
          error: 'Impossible de télécharger l\'image depuis Supabase',
          details: { fileUrl: wallpaper.file_url },
        });
        return false;
      }
      originalBuffer = downloadedBuffer;
      
      // Vérifier la signature du fichier téléchargé
      const signature = originalBuffer.slice(0, 4).toString('hex');
      const signatureAscii = originalBuffer.slice(0, 10).toString('ascii');
      console.log(`📥 Fichier téléchargé: signature hex=${signature}, ascii=${signatureAscii}`);
      
      // Sauvegarder l'original localement (y compris les BMP)
      await fs.writeFile(originalPath, originalBuffer);
      console.log(`✅ Original téléchargé et sauvegardé localement: original.${originalExt}`);
    }
    
    // Pour les BMP, convertir en PNG avec jimp puis utiliser Sharp pour WebP
    let bufferForConversion = originalBuffer;
    
    if (isBMP) {
      // Pour les BMP, convertir en JPG en niveaux de gris (grayscale)
      const jpgPath = path.join(wallpaperDir, 'image.jpg');
      
      // Si forceRegenerate est activé, supprimer le JPG et PNG intermédiaire existants
      if (forceRegenerate) {
        try {
          await fs.unlink(jpgPath);
          console.log(`🗑️  JPG existant supprimé (régénération forcée)`);
        } catch {
          // Fichier n'existe pas, c'est OK
        }
        try {
          const pngPath = path.join(wallpaperDir, 'intermediate.png');
          await fs.unlink(pngPath);
          console.log(`🗑️  PNG intermédiaire supprimé (régénération forcée)`);
        } catch {
          // Fichier n'existe pas, c'est OK
        }
      }
      
      try {
        // Vérifier si le JPG existe déjà et est valide
        const stats = await fs.stat(jpgPath);
        if (stats.size === 0 || stats.size < 100) { // Moins de 100 bytes = probablement corrompu
          throw new Error(`JPG existant invalide (${stats.size} bytes), régénération nécessaire`);
        }
        bufferForConversion = await fs.readFile(jpgPath);
        
        // Vérifier que Sharp peut lire le fichier
        const testMetadata = await sharp(bufferForConversion).metadata();
        if (!testMetadata.width || !testMetadata.height) {
          throw new Error('JPG existant non lisible par Sharp, régénération nécessaire');
        }
        
        // Vérifier la luminosité pour détecter les images noires
        const statsImg = await sharp(bufferForConversion).stats();
        const avgBrightness = statsImg.channels.length === 1 
          ? statsImg.channels[0].mean 
          : (statsImg.channels[0].mean + statsImg.channels[1].mean + statsImg.channels[2].mean) / 3;
        
        if (avgBrightness < 10) {
          throw new Error(`JPG existant trop sombre (luminosité: ${avgBrightness.toFixed(1)}), régénération nécessaire`);
        }
        
        console.log(`📁 JPG déjà présent (${(stats.size / 1024).toFixed(2)} KB, ${testMetadata.width}x${testMetadata.height}, luminosité: ${avgBrightness.toFixed(1)})`);
      } catch {
        console.log(`🔄 Conversion BMP -> JPG en niveaux de gris (qualité maximale)...`);
        
        // Essayer d'abord Sharp directement avec conversion en niveaux de gris
        let sharpWorked = false;
        try {
          console.log(`🔄 Tentative avec Sharp directement (niveaux de gris)...`);
          await sharp(originalPath)
            .greyscale()
            .jpeg({ 
              quality: 100,
              mozjpeg: true,
            })
            .toFile(jpgPath);
          
          // Valider le JPG généré
          const testJpg = await fs.readFile(jpgPath);
          const testMetadata = await sharp(testJpg).metadata();
          if (testMetadata.width && testMetadata.height) {
            // Vérifier la luminosité moyenne
            const stats = await sharp(testJpg).stats();
            const avgBrightness = stats.channels.length === 1 
              ? stats.channels[0].mean 
              : (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
            
            if (avgBrightness > 10) { // Si la luminosité moyenne est > 10, ce n'est probablement pas tout noir
              bufferForConversion = testJpg;
              sharpWorked = true;
              console.log(`✅ BMP converti en JPG avec Sharp directement (${testMetadata.width}x${testMetadata.height}, luminosité: ${avgBrightness.toFixed(1)})`);
            } else {
              console.log(`⚠️  Sharp a généré un JPG trop sombre (luminosité: ${avgBrightness.toFixed(1)}), utilisation du fallback...`);
            }
          }
        } catch (sharpError: any) {
          console.log(`⚠️  Sharp ne peut pas convertir directement (${sharpError.message}), utilisation du fallback...`);
        }
        
        // Si Sharp n'a pas fonctionné, utiliser bmp-js + pngjs
        if (!sharpWorked) {
          try {
            // Décoder le BMP avec bmp-js
            const bmpModule = await import('bmp-js');
            const { PNG } = await import('pngjs');
            const bmp = (bmpModule as any).default || bmpModule;
            const bmpData = bmp.decode(originalBuffer);
            
            console.log(`📊 BMP décodé: ${bmpData.width}x${bmpData.height}, données: ${bmpData.data.length} bytes`);
            
            // bmp-js retourne ABGR (4 bytes par pixel)
            const abgrData = bmpData.data;
            const pixelCount = bmpData.width * bmpData.height;
            const grayData = Buffer.alloc(pixelCount);
            
            // Vérifier quelques pixels pour comprendre le format
            if (abgrData.length > 0) {
              const sampleR = abgrData[3];
              const sampleG = abgrData[2];
              const sampleB = abgrData[1];
              const sampleA = abgrData[0];
              console.log(`📊 Échantillon pixel [0]: A=${sampleA}, B=${sampleB}, G=${sampleG}, R=${sampleR}`);
            }
            
            // Conversion ABGR -> Grayscale
            // ABGR format: [A, B, G, R] -> on veut R, G, B pour calculer le gris
            for (let i = 0; i < abgrData.length; i += 4) {
              const r = abgrData[i + 3]; // Red (dernier byte)
              const g = abgrData[i + 2]; // Green
              const b = abgrData[i + 1]; // Blue
              // Alpha ignoré pour le calcul du gris
              
              // Calculer le niveau de gris avec la formule standard
              const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
              grayData[Math.floor(i / 4)] = gray;
            }
            
            // Vérifier quelques valeurs de gris générées
            if (grayData.length > 0) {
              const sampleGray = grayData[0];
              const avgGray = grayData.reduce((sum, val) => sum + val, 0) / grayData.length;
              console.log(`📊 Échantillon gris [0]: ${sampleGray}, moyenne: ${avgGray.toFixed(1)}`);
              
              if (avgGray < 10) {
                console.warn(`⚠️  Les valeurs de gris sont très faibles, vérification de la conversion...`);
              }
            }
            
            // Créer un PNG en niveaux de gris avec pngjs
            const pngPath = path.join(wallpaperDir, 'intermediate.png');
            const png = new PNG({
              width: bmpData.width,
              height: bmpData.height,
              bitDepth: 8,
              colorType: 0, // Grayscale
              inputColorType: 0,
              inputHasAlpha: false,
            });
            
            png.data = grayData;
            
            // Sauvegarder le PNG
            await new Promise<void>((resolve, reject) => {
              const writeStream = createWriteStream(pngPath);
              png.pack().pipe(writeStream)
                .on('finish', resolve)
                .on('error', reject);
            });
            
            // Valider le PNG généré
            const pngBuffer = await fs.readFile(pngPath);
            const pngMetadata = await sharp(pngBuffer).metadata();
            if (!pngMetadata.width || !pngMetadata.height) {
              throw new Error('PNG généré invalide');
            }
            
            // Vérifier la luminosité du PNG
            const pngStats = await sharp(pngBuffer).stats();
            const pngBrightness = pngStats.channels[0].mean;
            console.log(`📊 Luminosité PNG: ${pngBrightness.toFixed(1)}`);
            
            if (pngBrightness < 10) {
              console.warn(`⚠️  PNG généré très sombre, problème possible dans la conversion`);
            }
            
            console.log(`✅ PNG en niveaux de gris créé avec pngjs (${pngMetadata.width}x${pngMetadata.height})`);
            
            // Convertir PNG -> JPG en niveaux de gris avec Sharp
            await sharp(pngBuffer)
              .greyscale() // S'assurer que c'est en niveaux de gris
              .jpeg({ 
                quality: 100,
                mozjpeg: true,
              })
              .toFile(jpgPath);
            
            bufferForConversion = await fs.readFile(jpgPath);
            const testMetadata = await sharp(bufferForConversion).metadata();
            if (!testMetadata.width || !testMetadata.height) {
              throw new Error('JPG généré invalide');
            }
            
            // Vérifier la luminosité du JPG final
            const jpgStats = await sharp(bufferForConversion).stats();
            const jpgBrightness = jpgStats.channels.length === 1 
              ? jpgStats.channels[0].mean 
              : (jpgStats.channels[0].mean + jpgStats.channels[1].mean + jpgStats.channels[2].mean) / 3;
            console.log(`📊 Luminosité JPG final: ${jpgBrightness.toFixed(1)}`);
            
            console.log(`✅ PNG converti en JPG en niveaux de gris (${(bufferForConversion.length / 1024 / 1024).toFixed(2)} MB, ${testMetadata.width}x${testMetadata.height}, qualité: 100)`);
          } catch (conversionError: any) {
            console.error(`❌ Échec conversion BMP->JPG: ${conversionError.message}`);
            await writeLog({
              timestamp: new Date().toISOString(),
              wallpaperId: wallpaper.id,
              wallpaperTitle: wallpaper.title,
              step: 'bmp-to-jpg-grayscale',
              error: `Échec conversion BMP->JPG: ${conversionError.message}`,
              details: { 
                conversionError: conversionError.message,
                stack: conversionError.stack,
              },
            });
            return false;
          }
        }
      }
    }
    
    // Obtenir les métadonnées de l'image pour calculer la taille optimale
    let imageMetadata;
    try {
      imageMetadata = await sharp(bufferForConversion).metadata();
      if (!imageMetadata.width || !imageMetadata.height) {
        console.error(`❌ Métadonnées d'image invalides pour ${wallpaper.id}`);
        return false;
      }
    } catch (error: any) {
      const errorMsg = `Impossible de lire les métadonnées de l'image: ${error.message}`;
      console.error(`❌ ${errorMsg} pour ${wallpaper.id}`);
      
      await writeLog({
        timestamp: new Date().toISOString(),
        wallpaperId: wallpaper.id,
        wallpaperTitle: wallpaper.title,
        step: 'read-metadata',
        error: errorMsg,
        details: {
          bufferSize: bufferForConversion.length,
          bufferStart: bufferForConversion.slice(0, 20).toString('hex'),
          isBMP,
          originalExt,
        },
      });
      
      return false;
    }
    
    // Pour les BMP, utiliser le JPG déjà créé
    // Pour les autres formats, convertir en WebP
    let finalImagePath: string;
    let finalImageStats: any;
    
    if (isBMP) {
      // Le JPG a déjà été créé dans la section précédente
      finalImagePath = path.join(wallpaperDir, 'image.jpg');
      finalImageStats = await fs.stat(finalImagePath);
      console.log(`✅ JPG utilisé: image.jpg (${(finalImageStats.size / 1024 / 1024).toFixed(2)} MB, ${imageMetadata.width}x${imageMetadata.height}, qualité: 100)`);
    } else {
      // Pour les autres formats, convertir en WebP avec qualité maximale
      const targetWidth = undefined; // Pas de redimensionnement
      const quality = 100; // Qualité maximale
      
      const webpPath = path.join(wallpaperDir, 'image.webp');
      const webpConverted = await convertToWebP(bufferForConversion, webpPath, quality, targetWidth, {
        effort: 2,
        smartSubsample: false,
        nearLossless: true,
      }, wallpaper.id, wallpaper.title);
      
      if (!webpConverted) {
        console.error(`❌ Échec de la conversion WebP pour ${wallpaper.id}`);
        return false;
      }
      
      finalImagePath = webpPath;
      finalImageStats = await fs.stat(webpPath);
      console.log(`✅ WebP créé: image.webp (${(finalImageStats.size / 1024 / 1024).toFixed(2)} MB, ${imageMetadata.width}x${imageMetadata.height}, qualité: ${quality})`);
    }
    
    // Créer la vignette (thumbnail)
    const thumbnailPath = path.join(wallpaperDir, isBMP ? 'thumbnail.jpg' : 'thumbnail.webp');
    
    if (isBMP) {
      // Pour les BMP, créer un thumbnail JPG en niveaux de gris avec qualité maximale
      const jpgPath = path.join(wallpaperDir, 'image.jpg');
      const thumbnailSource = await fs.readFile(jpgPath);
      
      await sharp(thumbnailSource)
        .greyscale() // S'assurer que c'est en niveaux de gris
        .resize(400, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ 
          quality: 100, // Qualité maximale pour thumbnails aussi
          mozjpeg: true,
        })
        .toFile(thumbnailPath);
    } else {
      // Pour les autres formats, créer un thumbnail WebP
      const thumbnailQuality = 100; // Qualité maximale
      const thumbnailConverted = await convertToWebP(bufferForConversion, thumbnailPath, thumbnailQuality, 400, {
        effort: 2,
        smartSubsample: false,
      }, wallpaper.id, wallpaper.title);
      
      if (!thumbnailConverted) {
        console.error(`❌ Échec de la conversion thumbnail pour ${wallpaper.id}`);
        return false;
      }
    }
    
    const thumbStats = await fs.stat(thumbnailPath);
    console.log(`✅ Thumbnail créé: ${isBMP ? 'thumbnail.jpg' : 'thumbnail.webp'} (${(thumbStats.size / 1024).toFixed(2)} KB, qualité: 100)`);
    
    // Créer les chemins relatifs depuis /public
    // Pour les BMP, utiliser JPG ; pour les autres formats, utiliser WebP
    const relativeImagePath = isBMP 
      ? `/wallpapers/${wallpaper.id}/image.jpg`
      : `/wallpapers/${wallpaper.id}/image.webp`;
    const relativeThumbnailPath = isBMP
      ? `/wallpapers/${wallpaper.id}/thumbnail.jpg`
      : `/wallpapers/${wallpaper.id}/thumbnail.webp`;
    // Toujours garder le BMP original pour téléchargement
    const relativeOriginalPath = `/wallpapers/${wallpaper.id}/original.${originalExt}`;
    
    // Marquer comme exporté dans Supabase (et retirer pending_export)
    const { error: updateError } = await supabase
      .from('wallpapers')
      .update({
        exported_to_static: true,
        pending_export: false, // Plus en attente
        static_webp_path: relativeImagePath, // JPG pour BMP, WebP pour autres
        static_thumbnail_path: relativeThumbnailPath,
        static_original_path: relativeOriginalPath,
      })
      .eq('id', wallpaper.id);
    
    if (updateError) {
      console.error(`❌ Erreur lors de la mise à jour du flag exported_to_static:`, updateError);
      return false;
    }
    
    console.log(`✅ Wallpaper exporté avec succès: ${wallpaper.id}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Erreur lors de l'export du wallpaper ${wallpaper.id}: ${error.message || error}`);
    console.error(`   Stack: ${error.stack || 'N/A'}`);
    return false;
  }
}

/**
 * Crée le fichier JSON index avec toutes les métadonnées
 */
async function createWallpapersIndex(wallpapers: WallpaperMetadata[]): Promise<void> {
  const indexPath = path.join(projectRoot, 'public', 'wallpapers', 'index.json');
  
  // Trier par date de création (plus récent en premier)
  const sorted = wallpapers.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });
  
  const index = {
    version: '1.0',
    generated_at: new Date().toISOString(),
    total: sorted.length,
    wallpapers: sorted,
  };
  
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`\n✅ Index JSON créé: ${indexPath} (${sorted.length} wallpapers)`);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Début de l\'export des Wallpapers vers fichiers statiques...\n');
  
  // Vider le log précédent
  await clearLog();
  console.log(`📝 Log des erreurs: ${logFile}\n`);
  
  const supabaseAdmin = getSupabaseAdmin();
  
  // Récupérer TOUS les wallpapers publiés pour régénération complète
  // Force la régénération de toutes les images WebP avec la nouvelle compression
  const { data: allPublishedWallpapers, error: fetchError } = await supabaseAdmin
    .from('wallpapers')
    .select('*')
    .eq('status', 'published')
    .eq('hidden', false)
    .order('created_at', { ascending: false });
  
  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des wallpapers:', fetchError);
    process.exit(1);
  }
  
  // FORCER la régénération de tous les wallpapers (même ceux déjà exportés)
  // Cela permet d'appliquer la nouvelle compression optimisée
  const wallpapers = (allPublishedWallpapers || []) as WallpaperData[];
  const error = null;
  
  if (error) {
    console.error('❌ Erreur lors de la récupération des wallpapers:', error);
    process.exit(1);
  }
  
  if (!wallpapers || wallpapers.length === 0) {
    console.log('✅ Aucun wallpaper à exporter.');
    
    // Même s'il n'y a rien à exporter, on régénère l'index JSON avec tous les wallpapers exportés
    const { data: allExported } = await supabaseAdmin
      .from('wallpapers')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false)
      .eq('exported_to_static', true);
    
    if (allExported && allExported.length > 0) {
      const metadata: WallpaperMetadata[] = allExported.map(w => ({
        id: w.id,
        title: w.title,
        category: w.category,
        author_name: w.author_name,
        reddit_username: w.reddit_username,
        instagram_username: w.instagram_username,
        width: w.width,
        height: w.height,
        file_size: w.file_size,
        download_count: w.download_count,
        created_at: w.created_at,
        webp_path: w.static_webp_path || `/wallpapers/${w.id}/image.webp`,
        thumbnail_path: w.static_thumbnail_path || `/wallpapers/${w.id}/thumbnail.webp`,
        original_path: w.static_original_path || `/wallpapers/${w.id}/original.png`,
      }));
      
      await createWallpapersIndex(metadata);
    }
    
    return;
  }
  
  console.log(`📊 ${wallpapers.length} wallpaper(s) à exporter.\n`);
  
  // Créer le client Supabase pour Storage
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables d\'environnement manquantes: PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
    console.error('   Assurez-vous d\'avoir un fichier .env avec ces variables.');
    process.exit(1);
  }
  
  const supabaseStorage = createClient(supabaseUrl, supabaseServiceKey);
  
  // Exporter chaque wallpaper
  let successCount = 0;
  let errorCount = 0;
  const exportedMetadata: WallpaperMetadata[] = [];
  const errorDetails: Array<{ id: string; title?: string; error: string }> = [];
  
  for (let i = 0; i < wallpapers.length; i++) {
    const wallpaper = wallpapers[i];
    const progress = `[${i + 1}/${wallpapers.length}]`;
    
    try {
      const success = await exportWallpaper(supabaseStorage, wallpaper, true); // Force la régénération
      if (success) {
        successCount++;
        
        // Déterminer le format selon l'extension du fichier original
        const originalExt = wallpaper.file_name.split('.').pop()?.toLowerCase() || 'png';
        const isBmpWallpaper = originalExt === 'bmp';
        
        // Ajouter aux métadonnées avec les bons chemins selon le format
        exportedMetadata.push({
          id: wallpaper.id,
          title: wallpaper.title,
          category: wallpaper.category,
          author_name: wallpaper.author_name,
          reddit_username: wallpaper.reddit_username,
          instagram_username: wallpaper.instagram_username,
          width: wallpaper.width,
          height: wallpaper.height,
          file_size: wallpaper.file_size,
          download_count: wallpaper.download_count,
          created_at: wallpaper.created_at,
          webp_path: isBmpWallpaper 
            ? `/wallpapers/${wallpaper.id}/image.jpg`
            : `/wallpapers/${wallpaper.id}/image.webp`,
          thumbnail_path: isBmpWallpaper
            ? `/wallpapers/${wallpaper.id}/thumbnail.jpg`
            : `/wallpapers/${wallpaper.id}/thumbnail.webp`,
          original_path: `/wallpapers/${wallpaper.id}/original.${originalExt}`,
        });
      } else {
        errorCount++;
        const errorMsg = `Export échoué pour ${progress} ${wallpaper.title || wallpaper.id}`;
        errorDetails.push({
          id: wallpaper.id,
          title: wallpaper.title,
          error: errorMsg,
        });
        console.error(`❌ ${errorMsg}`);
      }
    } catch (error: any) {
      errorCount++;
      const errorMsg = `${error.message || 'Erreur inconnue'}`;
      errorDetails.push({
        id: wallpaper.id,
        title: wallpaper.title,
        error: errorMsg,
      });
      console.error(`❌ Erreur fatale ${progress} pour ${wallpaper.id}: ${errorMsg}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack.split('\n').slice(0, 2).join('\n')}`);
      }
    }
    
    // Afficher la progression tous les 50 wallpapers
    if ((i + 1) % 50 === 0) {
      console.log(`\n📊 Progression: ${i + 1}/${wallpapers.length} (${successCount} réussis, ${errorCount} échecs)\n`);
    }
  }
  
  // Afficher un résumé des erreurs si il y en a
  if (errorDetails.length > 0 && errorDetails.length <= 20) {
    console.log(`\n📋 Détails des erreurs (${errorDetails.length} premiers):`);
    errorDetails.slice(0, 20).forEach(({ id, title, error }) => {
      console.log(`   - ${title || id}: ${error}`);
    });
    if (errorDetails.length > 20) {
      console.log(`   ... et ${errorDetails.length - 20} autres erreurs`);
    }
  }
  
  // Récupérer aussi tous les wallpapers déjà exportés pour créer l'index complet
  const { data: allExported } = await supabaseAdmin
    .from('wallpapers')
    .select('*')
    .eq('status', 'published')
    .eq('hidden', false)
    .eq('exported_to_static', true);
  
  if (allExported) {
    // Créer l'index avec tous les wallpapers exportés
    const allMetadata: WallpaperMetadata[] = allExported.map(w => {
      // Déterminer le format selon original_path
      const originalPath = w.static_original_path || w.file_url || '';
      const isBmpWallpaper = originalPath.endsWith('.bmp') || w.file_name?.toLowerCase().endsWith('.bmp');
      
      return {
        id: w.id,
        title: w.title,
        category: w.category,
        author_name: w.author_name,
        reddit_username: w.reddit_username,
        instagram_username: w.instagram_username,
        width: w.width,
        height: w.height,
        file_size: w.file_size,
        download_count: w.download_count,
        created_at: w.created_at,
        webp_path: w.static_webp_path || (isBmpWallpaper 
          ? `/wallpapers/${w.id}/image.jpg`
          : `/wallpapers/${w.id}/image.webp`),
        thumbnail_path: w.static_thumbnail_path || (isBmpWallpaper
          ? `/wallpapers/${w.id}/thumbnail.jpg`
          : `/wallpapers/${w.id}/thumbnail.webp`),
        original_path: w.static_original_path || `/wallpapers/${w.id}/original.${w.file_name?.split('.').pop() || 'png'}`,
      };
    });
    
    await createWallpapersIndex(allMetadata);
  }
  
  console.log(`\n📊 Résumé de l'export:`);
  console.log(`   ✅ Réussis: ${successCount}`);
  console.log(`   ❌ Échecs: ${errorCount}`);
  console.log(`   📝 Total: ${wallpapers.length}`);
  
  // Afficher un résumé des erreurs si il y en a
  if (errorDetails.length > 0) {
    console.log(`\n⚠️  ${errorCount} wallpaper(s) n'ont pas pu être exportés.`);
    if (errorDetails.length <= 10) {
      console.log(`\n📋 Détails des erreurs:`);
      errorDetails.forEach(({ id, title, error }) => {
        console.log(`   - ${title || id}: ${error}`);
      });
    } else {
      console.log(`\n📋 Détails des erreurs (10 premiers sur ${errorDetails.length}):`);
      errorDetails.slice(0, 10).forEach(({ id, title, error }) => {
        console.log(`   - ${title || id}: ${error}`);
      });
      console.log(`   ... et ${errorDetails.length - 10} autres erreurs`);
    }
    
    // Ne pas faire échouer le script si on a réussi au moins quelques exports
    if (successCount === 0) {
      console.log(`\n❌ Aucun wallpaper n'a pu être exporté. Arrêt du script.`);
      process.exit(1);
    } else {
      console.log(`\n⚠️  Certains wallpapers n'ont pas pu être exportés, mais ${successCount} ont réussi.`);
      console.log(`   Vous pouvez relancer le script pour réessayer les échecs.`);
    }
  }
  
  if (errorCount === 0) {
    console.log('\n✅ Export terminé avec succès !');
  } else {
    console.log(`\n✅ Export partiel terminé (${successCount}/${wallpapers.length} réussis).`);
  }
}

// Exécuter le script
main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
