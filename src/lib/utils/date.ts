/**
 * Utilitaires pour le formatage des dates
 */

/**
 * Formate une date selon la langue
 */
export function formatDateByLang(date: Date | string, lang: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Déterminer la locale selon la langue
  let locale = 'en-US';
  if (lang === 'fr') {
    locale = 'fr-FR';
  } else if (lang === 'es') {
    locale = 'es-ES';
  } else if (lang === 'ru') {
    locale = 'ru-RU';
  } else if (lang === 'cn') {
    locale = 'zh-CN';
  }
  
  const options = {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const
  };
  
  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Formate une date pour l'affichage (évite les problèmes de parsing avec getFullYear/getMonth/getDate)
 */
export function formatDateForDisplay(dateStr: string): string {
  const d = new Date(dateStr);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  return monthNames[m] + ' ' + day + ', ' + y;
}

/**
 * Convertit une date en string ISO (évite les problèmes de parsing avec toISOString)
 * Utilise une méthode alternative pour éviter les problèmes de parsing esbuild
 */
export function convertDateToISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Utiliser une méthode alternative pour éviter les problèmes de parsing
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  const h = dateObj.getHours();
  const min = dateObj.getMinutes();
  const s = dateObj.getSeconds();
  const ms = dateObj.getMilliseconds();
  const pad = (n: number) => n < 10 ? '0' + n : String(n);
  const pad3 = (n: number) => n < 10 ? '00' + n : n < 100 ? '0' + n : String(n);
  return y + '-' + pad(m) + '-' + pad(d) + 'T' + pad(h) + ':' + pad(min) + ':' + pad(s) + '.' + pad3(ms) + 'Z';
}
