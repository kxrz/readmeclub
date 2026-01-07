/**
 * Chargeur de Wallpapers depuis fichiers statiques + JSON index
 * 
 * Ce module charge les wallpapers depuis /public/wallpapers/index.json
 * avec fallback vers Supabase si le fichier n'existe pas (mode dégradé).
 * 
 * Les filtres et la pagination sont gérés côté client via le JSON.
 */

import { getSupabaseAdmin } from '../supabase/admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

export interface WallpaperMetadata {
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

interface WallpapersIndex {
  version: string;
  generated_at: string;
  total: number;
  wallpapers: WallpaperMetadata[];
}

/**
 * Charge l'index JSON des wallpapers
 */
async function loadWallpapersIndex(): Promise<WallpapersIndex | null> {
  try {
    const indexPath = path.join(projectRoot, 'public', 'wallpapers', 'index.json');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(indexPath);
    } catch {
      return null; // Fichier n'existe pas
    }
    
    const fileContent = await fs.readFile(indexPath, 'utf-8');
    return JSON.parse(fileContent) as WallpapersIndex;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'index wallpapers:', error);
    return null;
  }
}

/**
 * Charge tous les wallpapers depuis l'index JSON
 */
export async function loadAllWallpapers(): Promise<WallpaperMetadata[]> {
  const index = await loadWallpapersIndex();
  
  if (index && index.wallpapers) {
    return index.wallpapers;
  }
  
  // Fallback vers Supabase
  console.warn('⚠️  Index JSON non trouvé, fallback vers Supabase');
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    
    // Convertir au format metadata
    return data.map(w => ({
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
      webp_path: w.static_webp_path || w.file_url,
      thumbnail_path: w.static_thumbnail_path || w.file_url,
      original_path: w.static_original_path || w.file_url,
    }));
  } catch (error) {
    console.error('Erreur lors du fallback Supabase:', error);
    return [];
  }
}

/**
 * Charge un wallpaper par ID
 */
export async function loadWallpaperById(id: string): Promise<WallpaperMetadata | null> {
  const allWallpapers = await loadAllWallpapers();
  return allWallpapers.find(w => w.id === id) || null;
}

/**
 * Filtre et trie les wallpapers selon les critères
 */
export function filterAndSortWallpapers(
  wallpapers: WallpaperMetadata[],
  options: {
    category?: string | null;
    sort?: 'latest' | 'popular' | 'name' | 'author';
  } = {}
): WallpaperMetadata[] {
  let filtered = [...wallpapers];
  
  // Filtrer par catégorie
  if (options.category) {
    filtered = filtered.filter(w => w.category === options.category);
  }
  
  // Trier
  switch (options.sort) {
    case 'popular':
      filtered.sort((a, b) => b.download_count - a.download_count);
      break;
    case 'name':
      filtered.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });
      break;
    case 'author':
      filtered.sort((a, b) => {
        const authorA = (a.author_name || a.reddit_username || '').toLowerCase();
        const authorB = (b.author_name || b.reddit_username || '').toLowerCase();
        return authorA.localeCompare(authorB);
      });
      break;
    case 'latest':
    default:
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      break;
  }
  
  return filtered;
}

/**
 * Pagine les wallpapers
 */
export function paginateWallpapers(
  wallpapers: WallpaperMetadata[],
  page: number,
  pageSize: number
): {
  wallpapers: WallpaperMetadata[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const total = wallpapers.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize;
  
  return {
    wallpapers: wallpapers.slice(from, to),
    total,
    totalPages,
    currentPage,
  };
}

/**
 * Obtient les statistiques des wallpapers
 */
export async function getWallpapersStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
}> {
  const allWallpapers = await loadAllWallpapers();
  
  const byCategory: Record<string, number> = {};
  
  for (const wallpaper of allWallpapers) {
    const category = wallpaper.category || 'other';
    byCategory[category] = (byCategory[category] || 0) + 1;
  }
  
  return {
    total: allWallpapers.length,
    byCategory,
  };
}
