/**
 * Normalise une URL en supprimant le slash final s'il existe
 * Gère les cas où url peut être string, URL, ou undefined
 */
export function normalizeSiteUrl(url: string | URL | undefined): string {
  if (!url) return 'https://readme.club';
  
  // Convertir URL en string si nécessaire
  const urlString = typeof url === 'string' ? url : url.toString();
  
  // Supprimer le slash final s'il existe
  return urlString.endsWith('/') ? urlString.slice(0, -1) : urlString;
}

/**
 * Construit une URL complète à partir d'un chemin relatif
 */
export function buildUrl(path: string, siteUrl?: string | URL): string {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedSiteUrl}${normalizedPath}`;
}

