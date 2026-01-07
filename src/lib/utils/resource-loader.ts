/**
 * Chargeur de Resources depuis fichiers statiques + JSON index
 * 
 * Ce module charge les resources depuis /public/resources/index.json
 * avec fallback vers Supabase si le fichier n'existe pas (mode dégradé).
 * 
 * Les filtres et la pagination sont gérés côté serveur via le JSON.
 */

import { getSupabaseAdmin } from '../supabase/admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Resource } from '../supabase/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

/**
 * Charge l'index JSON des resources
 */
async function loadResourcesIndex(): Promise<Resource[] | null> {
  try {
    const indexPath = path.join(projectRoot, 'public', 'resources', 'index.json');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(indexPath);
    } catch {
      return null; // Fichier n'existe pas
    }
    
    const fileContent = await fs.readFile(indexPath, 'utf-8');
    return JSON.parse(fileContent) as Resource[];
  } catch (error) {
    console.error('Erreur lors du chargement de l\'index resources:', error);
    return null;
  }
}

/**
 * Charge toutes les resources depuis l'index JSON
 */
export async function loadAllResources(): Promise<Resource[]> {
  const resources = await loadResourcesIndex();
  
  if (resources && resources.length > 0) {
    return resources;
  }
  
  // Fallback vers Supabase
  console.warn('⚠️  Index JSON non trouvé, fallback vers Supabase');
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('status', 'approved')
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur Supabase fallback:', error);
      return [];
    }
    
    return (data || []) as Resource[];
  } catch (error) {
    console.error('Erreur lors du fallback Supabase:', error);
    return [];
  }
}

/**
 * Charge une resource par son ID
 */
export async function loadResourceById(id: string): Promise<Resource | null> {
  const resources = await loadAllResources();
  const resource = resources.find(r => r.id === id);
  
  if (resource) {
    return resource;
  }
  
  // Fallback vers Supabase
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .eq('hidden', false)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data as Resource;
  } catch (error) {
    console.error('Erreur lors du fallback Supabase:', error);
    return null;
  }
}

/**
 * Filtre et trie les resources
 */
export function filterAndSortResources(
  resources: Resource[],
  options?: {
    type?: string;
    sortBy?: 'created_at' | 'downloads_count' | 'title';
    sortOrder?: 'asc' | 'desc';
  }
): Resource[] {
  let filtered = [...resources];
  
  // Filtrer par type
  if (options?.type) {
    filtered = filtered.filter(r => r.type === options.type);
  }
  
  // Trier
  const sortBy = options?.sortBy || 'created_at';
  const sortOrder = options?.sortOrder || 'desc';
  
  filtered.sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'downloads_count':
        aValue = a.downloads_count || 0;
        bValue = b.downloads_count || 0;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
  
  return filtered;
}

/**
 * Pagine les resources
 */
export function paginateResources(
  resources: Resource[],
  page: number,
  limit: number
): {
  data: Resource[];
  total: number;
  totalPages: number;
  currentPage: number;
} {
  const total = resources.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const offset = (currentPage - 1) * limit;
  
  const data = resources.slice(offset, offset + limit);
  
  return {
    data,
    total,
    totalPages,
    currentPage,
  };
}
