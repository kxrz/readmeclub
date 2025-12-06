/**
 * Normalise une URL en supprimant le slash final s'il existe
 */
export function normalizeSiteUrl(url: string | undefined): string {
  if (!url) return 'https://readme.club';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Construit une URL complète à partir d'un chemin relatif
 */
export function buildUrl(path: string, siteUrl?: string): string {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedSiteUrl}${normalizedPath}`;
}

