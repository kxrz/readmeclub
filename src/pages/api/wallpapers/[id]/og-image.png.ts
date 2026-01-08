export const prerender = false;

import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../../../');

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response('ID required', { status: 400 });
    }
    
    // Charger depuis le JSON statique d'abord (plus rapide)
    let wallpaper: any = null;
    try {
      const wallpaperIndexPath = join(projectRoot, 'public', 'wallpapers', 'index.json');
      const indexData = JSON.parse(readFileSync(wallpaperIndexPath, 'utf-8'));
      wallpaper = indexData.wallpapers?.find((w: any) => w.id === id);
    } catch (e) {
      // Fallback vers Supabase si le JSON n'existe pas
    }
    
    // Fallback vers Supabase si pas trouvé dans le JSON
    if (!wallpaper) {
      const { data } = await supabase
        .from('wallpapers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!data) {
        return new Response('Wallpaper not found', { status: 404 });
      }
      
      // Convertir au format metadata
      const originalPath = data.static_original_path || data.file_url || '';
      const isBmpWallpaper = originalPath.endsWith('.bmp') || data.file_name?.toLowerCase().endsWith('.bmp');
      
      wallpaper = {
        id: data.id,
        webp_path: data.static_webp_path || (isBmpWallpaper 
          ? `/wallpapers/${data.id}/image.jpg`
          : `/wallpapers/${data.id}/image.webp`),
        thumbnail_path: data.static_thumbnail_path || (isBmpWallpaper
          ? `/wallpapers/${data.id}/thumbnail.jpg`
          : `/wallpapers/${data.id}/thumbnail.webp`),
        original_path: data.static_original_path || `/wallpapers/${data.id}/original.${data.file_name?.split('.').pop() || 'png'}`,
      };
    }
    
    // Vérifier d'abord si une image OG pré-générée existe
    const preGeneratedOGPath = join(projectRoot, 'public', 'og-images', 'wallpapers', `${id}.png`);
    try {
      const fs = await import('fs/promises');
      await fs.access(preGeneratedOGPath);
      // Utiliser l'image pré-générée si elle existe
      const ogImageBuffer = readFileSync(preGeneratedOGPath);
      return new Response(ogImageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch {
      // Fallback: générer à la volée si pas pré-générée
    }
    
    // Déterminer le chemin de l'image à utiliser (priorité: webp_path > thumbnail_path)
    const imagePath = wallpaper.webp_path || wallpaper.thumbnail_path;
    if (!imagePath) {
      return new Response('Wallpaper image not found', { status: 404 });
    }
    
    // Chemin complet vers l'image dans public/
    const fullImagePath = join(projectRoot, 'public', imagePath);
    
    // Vérifier si le fichier existe
    try {
      const fs = await import('fs/promises');
      await fs.access(fullImagePath);
    } catch {
      return new Response('Wallpaper image file not found', { status: 404 });
    }
    
    // Charger et cropper l'image au format OG (1200x630)
    const imageBuffer = readFileSync(fullImagePath);
    const ogImageBuffer = await sharp(imageBuffer)
      .resize(1200, 630, {
        fit: 'cover', // Crop pour remplir exactement le format OG
        position: 'center', // Centrer le crop
      })
      .png()
      .toBuffer();
    
    return new Response(ogImageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('OG image generation error:', error);
    return new Response('Error generating image', { status: 500 });
  }
};

