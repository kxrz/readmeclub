import { ui, type UIKey } from './languages';
import { tipsTranslations } from './tips-translations';

export type Lang = keyof typeof ui;

export function useTranslations(lang: Lang = 'en') {
  return function t(key: UIKey, params?: Record<string, string | number>): string {
    let translation = ui[lang]?.[key] || ui['en'][key] || key;
    
    // Replace {param} with values
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      });
    }
    
    return translation;
  };
}

export function getLangFromUrl(url: URL): Lang {
  const pathname = url.pathname;
  const langMatch = pathname.match(/^\/(fr|es|ru|cn)(\/|$)/);
  
  if (langMatch) {
    return langMatch[1] as Lang;
  }
  
  return 'en';
}

export function getLangPrefix(lang: Lang): string {
  return lang === 'en' ? '' : `/${lang}`;
}

/**
 * Generate a URL for the current page with a different language prefix
 * Preserves the current path and only changes the language prefix
 */
export function getLocalizedUrl(currentUrl: URL, targetLang: Lang): string {
  const pathname = currentUrl.pathname;
  const search = currentUrl.search;
  const hash = currentUrl.hash;
  
  // Remove current language prefix if present
  const langPattern = /^\/(en|fr|es|ru|cn)(\/|$)/;
  let cleanPath = pathname.replace(langPattern, '/');
  
  // Handle root path
  if (cleanPath === '/' && targetLang === 'en') {
    return `/${search}${hash}`;
  }
  
  // Add target language prefix
  const targetPrefix = getLangPrefix(targetLang);
  const newPath = targetPrefix + (cleanPath === '/' ? '' : cleanPath);
  
  return `${newPath}${search}${hash}`;
}

/**
 * Get translated category name
 */
export function getTranslatedCategory(category: string, lang: Lang): string {
  if (lang === 'en') return category;
  return tipsTranslations.categories[lang]?.[category] || category;
}

/**
 * Get translated tip text
 */
export function getTranslatedTip(tipId: number, lang: Lang, fallback: string): string {
  if (lang === 'en') return fallback;
  return tipsTranslations.tips[lang]?.[tipId] || fallback;
}

