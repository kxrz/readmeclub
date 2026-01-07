/**
 * Chargeur de données de localisation depuis fichiers statiques + JSON index
 *
 * Ce module charge les statistiques de localisation depuis /public/data/locations.json
 * avec fallback vers Supabase si le fichier n'existe pas (mode dégradé).
 */

import { getSupabaseAdmin } from '../supabase/admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { countries } from './countries';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

interface LocationStats {
  stats: Record<string, number>; // country_code -> count
  total: number;
  countries: number;
  exportDate: string;
  period: string;
}

interface LocationMarker {
  code: string;
  count: number;
  name: string;
  coords: [number, number] | null;
}

/**
 * Charge l'index JSON des statistiques de localisation
 */
async function loadLocationsIndex(): Promise<LocationStats | null> {
  try {
    const indexPath = path.join(projectRoot, 'public', 'data', 'locations.json');

    // Vérifier si le fichier existe
    try {
      await fs.access(indexPath);
    } catch {
      return null; // Fichier n'existe pas
    }

    const fileContent = await fs.readFile(indexPath, 'utf-8');
    return JSON.parse(fileContent) as LocationStats;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'index locations:', error);
    return null;
  }
}

/**
 * Charge les statistiques de localisation depuis l'index JSON
 */
export async function loadLocationStats(): Promise<{
  stats: Record<string, number>;
  total: number;
  countries: number;
  period: string;
}> {
  const locationStats = await loadLocationsIndex();

  if (locationStats) {
    return {
      stats: locationStats.stats,
      total: locationStats.total,
      countries: locationStats.countries,
      period: locationStats.period,
    };
  }

  // Fallback vers Supabase (toutes les données)
  console.warn('⚠️  Index JSON non trouvé, fallback vers Supabase (toutes les données)');

  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('location_declarations')
      .select('country_code, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase fallback:', error);
      return {
        stats: {},
        total: 0,
        countries: 0,
        period: 'All time',
      };
    }

    // Agrégation par country_code
    const stats: Record<string, number> = {};
    let total = 0;
    if (data) {
      for (const declaration of data) {
        const code = (declaration.country_code || '').toUpperCase();
        if (code && code.length === 2) {
          stats[code] = (stats[code] || 0) + 1;
          total++;
        }
      }
    }

    // Déterminer la période des données
    let period = 'All time';
    if (data && data.length > 0) {
      const dates = data.map(d => new Date(d.created_at));
      const oldest = new Date(Math.min(...dates.map(d => d.getTime())));
      const newest = new Date(Math.max(...dates.map(d => d.getTime())));
      if (oldest.getFullYear() === newest.getFullYear()) {
        period = `${oldest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - ${newest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      }
    }

    return {
      stats,
      total,
      countries: Object.keys(stats).length,
      period,
    };
  } catch (error) {
    console.error('Erreur lors du fallback Supabase:', error);
    return {
      stats: {},
      total: 0,
      countries: 0,
      period: 'All time',
    };
  }
}

/**
 * Génère les markers pour la carte Leaflet
 */
export function generateLocationMarkers(stats: Record<string, number>): LocationMarker[] {
  return Object.entries(stats)
    .map(([code, count]) => ({
      code,
      count,
      name: countries[code]?.name || code,
      coords: countries[code]?.coords || null,
    }))
    .filter(m => m.coords !== null);
}
