/**
 * Chargeur pour le contenu HTML du guide
 * Extrait le contenu du body depuis guide.html et génère une table des matières
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

/**
 * Génère un ID unique à partir d'un titre
 */
function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extrait la table des matières depuis le HTML
 */
function extractTableOfContents(htmlContent: string): TableOfContentsItem[] {
  const toc: TableOfContentsItem[] = [];
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi;
  
  // Extraire tous les h2 et h3
  const headings: Array<{ level: number; title: string; position: number }> = [];
  
  let match;
  while ((match = h2Regex.exec(htmlContent)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim();
    if (title && !title.toLowerCase().includes('table of contents')) {
      headings.push({ level: 2, title, position: match.index });
    }
  }
  
  while ((match = h3Regex.exec(htmlContent)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, '').trim();
    if (title) {
      headings.push({ level: 3, title, position: match.index });
    }
  }
  
  // Trier par position et construire la structure hiérarchique
  headings.sort((a, b) => a.position - b.position);
  
  let currentH2: TableOfContentsItem | null = null;
  for (const heading of headings) {
    const id = generateId(heading.title);
    
    if (heading.level === 2) {
      currentH2 = { id, title: heading.title, level: 2, children: [] };
      toc.push(currentH2);
    } else if (heading.level === 3 && currentH2) {
      currentH2.children = currentH2.children || [];
      currentH2.children.push({ id, title: heading.title, level: 3 });
    }
  }
  
  return toc;
}

/**
 * Charge toutes les ressources une fois pour le cache
 */
let resourcesCache: Array<{ id: string; external_link?: string; description?: string; title?: string }> | null = null;

async function loadResourcesCache(): Promise<Array<{ id: string; external_link?: string; description?: string; title?: string }>> {
  if (resourcesCache) {
    return resourcesCache;
  }
  
  try {
    const { getSupabaseAdmin } = await import('../supabase/admin');
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data: resources } = await supabaseAdmin
      .from('resources')
      .select('id, external_link, description, title')
      .eq('status', 'approved')
      .eq('hidden', false);
    
    resourcesCache = resources || [];
    return resourcesCache;
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error);
    return [];
  }
}

/**
 * Trouve une ressource par son ancien record ID ou URL
 */
async function findResourceByRecordId(recordId: string, fullUrl: string): Promise<string | null> {
  const resources = await loadResourcesCache();
  
  // Chercher par record ID dans external_link ou description
  const matching = resources.find(r => 
    r.external_link?.includes(recordId) || 
    r.description?.includes(recordId) ||
    r.external_link?.includes(fullUrl) ||
    r.external_link?.includes(`ddl?record=${recordId}`) ||
    r.description?.includes(`ddl?record=${recordId}`)
  );
  
  return matching?.id || null;
}

/**
 * Traite les liens selon les règles spécifiées
 */
async function processLinks(content: string): Promise<string> {
  let processed = content;
  
  // 1. Remplacer les anciens domaines par readme.club
  processed = processed.replace(/https:\/\/xteink-community-hub\.replit\.app/g, 'https://readme.club');
  processed = processed.replace(/https:\/\/xteink\.dontthinkjustbuild\.com/g, 'https://readme.club');
  
  // 2. Traiter les URLs avec ddl?record= pour les convertir en liens vers ressources
  const recordUrlRegex = /(https?:\/\/[^\)\s"']+ddl\?record=([^\)\s"']+))/gi;
  const recordMatches = Array.from(processed.matchAll(recordUrlRegex));
  
  for (const match of recordMatches) {
    const fullUrl = match[0];
    const recordId = match[2];
    
    const resourceId = await findResourceByRecordId(recordId, fullUrl);
    if (resourceId) {
      // Remplacer l'URL par un lien vers la ressource spécifique
      processed = processed.replace(fullUrl, `/resources/${resourceId}`);
    } else {
      // Si pas de mapping trouvé, pointer vers la page ressources générale
      processed = processed.replace(fullUrl, '/resources');
    }
  }
  
  // 3. Traiter "URL: https://...ddl?record=XXX" -> lien vers ressource
  const urlPatternRegex = /URL:\s*(https?:\/\/[^\s\)]+ddl\?record=([^\)\s"']+))/gi;
  const urlMatches = Array.from(processed.matchAll(urlPatternRegex));
  
  for (const match of urlMatches) {
    const fullUrl = match[1];
    const recordId = match[2];
    
    const resourceId = await findResourceByRecordId(recordId, fullUrl);
    if (resourceId) {
      processed = processed.replace(match[0], `<a href="/resources/${resourceId}" class="text-accent-500 hover:underline">View Resource</a>`);
    } else {
      // Si pas de mapping trouvé, pointer vers la page ressources générale
      processed = processed.replace(match[0], `<a href="/resources" class="text-accent-500 hover:underline">View Resources</a>`);
    }
  }
  
  // 4. Rendre les URLs cliquables (si pas déjà dans un lien)
  // D'abord, protéger les URLs déjà dans des liens
  const linkProtection = new Map<string, string>();
  let protectionIndex = 0;
  
  // Protéger les liens existants
  processed = processed.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi, (match, url, text) => {
    const key = `__LINK_PROTECTION_${protectionIndex++}__`;
    linkProtection.set(key, match);
    return key;
  });
  
  // Protéger les liens markdown
  processed = processed.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text, url) => {
    const key = `__LINK_PROTECTION_${protectionIndex++}__`;
    linkProtection.set(key, match);
    return key;
  });
  
  // Rendre les URLs restantes cliquables
  processed = processed.replace(/(https?:\/\/[^\s\)"']+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent-500 hover:underline">${url}</a>`;
  });
  
  // Restaurer les liens protégés
  for (const [key, value] of linkProtection.entries()) {
    processed = processed.replace(key, value);
  }
  
  // 5. Rendre les emails cliquables (si pas déjà dans un lien)
  processed = processed.replace(/(?<!mailto:)([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, (email) => {
    // Vérifier si c'est déjà dans un lien
    if (processed.indexOf(`mailto:${email}`) !== -1) return email;
    return `<a href="mailto:${email}" class="text-accent-500 hover:underline">${email}</a>`;
  });
  
  // 6. Lier "iamkxrz" vers Reddit (seulement si pas déjà dans un lien)
  processed = processed.replace(/\biamkxrz\b/gi, (match, offset) => {
    // Vérifier le contexte avant et après
    const before = processed.substring(Math.max(0, offset - 100), offset);
    const after = processed.substring(offset + match.length, Math.min(processed.length, offset + match.length + 100));
    
    // Ne pas remplacer si déjà dans un lien
    if (before.includes('href=') || before.includes('reddit.com/user/iamkxrz') || after.includes('</a>')) {
      return match;
    }
    
    return '<a href="https://reddit.com/user/iamkxrz" target="_blank" rel="noopener noreferrer" class="text-accent-500 hover:underline">iamkxrz</a>';
  });
  
  return processed;
}

/**
 * Ajoute des IDs aux titres et nettoie le HTML
 */
async function processGuideContent(htmlContent: string, toc: TableOfContentsItem[]): Promise<string> {
  let processed = htmlContent;
  
  // Supprimer le titre principal "Xteink X4 Complete Community Guide"
  processed = processed.replace(/<h1[^>]*>.*?Xteink X4 Complete Community Guide.*?<\/h1>/gi, '');
  processed = processed.replace(/<h1[^>]*>.*?Complete Community Guide.*?<\/h1>/gi, '');
  
  // Supprimer la TOC HTML du contenu (celle qui est dans le HTML original)
  // Supprimer le titre "Table of Contents" et la liste <ol> qui suit immédiatement
  // Pattern: <h2>Table of Contents</h2> suivi de <ol>...</ol> avec la liste des chapitres
  processed = processed.replace(/<h2[^>]*>.*?table of contents.*?<\/h2>\s*<ol[^>]*>[\s\S]*?<\/ol>/gi, '');
  
  // Supprimer aussi les autres variantes de TOC
  processed = processed.replace(/<ul[^>]*>[\s\S]*?<li[^>]*>[\s\S]*?<a[^>]*href=["']#[^"']+["'][^>]*>[\s\S]*?<\/a>[\s\S]*?<\/li>[\s\S]*?<\/ul>/gi, '');
  processed = processed.replace(/<nav[^>]*>[\s\S]*?<a[^>]*href=["']#[^"']+["'][^>]*>[\s\S]*?<\/nav>/gi, '');
  processed = processed.replace(/<div[^>]*class=["'][^"']*toc[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
  processed = processed.replace(/<div[^>]*class=["'][^"']*table-of-contents[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Ajouter un séparateur propre après le TL;DR et avant le premier chapitre
  // Pattern: </ol> (fin de la liste TL;DR) suivi de <h2> (premier chapitre "1. Setup...")
  processed = processed.replace(/(<\/ol>)\s*(<h2[^>]*>)/gi, (match, closingOl, h2Tag) => {
    // Vérifier le contexte avant pour s'assurer que c'est bien après le TL;DR
    const matchIndex = processed.indexOf(match);
    const beforeMatch = processed.substring(Math.max(0, matchIndex - 500), matchIndex);
    
    // Vérifier si c'est après le TL;DR (contient "tldr" ou "essential things")
    // et avant le premier chapitre (le h2 contient "Setup" ou un numéro)
    const h2Content = h2Tag.match(/>([^<]+)</)?.[1] || '';
    const isFirstChapter = /^\d+\.\s/.test(h2Content.trim()) || h2Content.toLowerCase().includes('setup');
    
    if ((beforeMatch.toLowerCase().includes('tldr') || beforeMatch.toLowerCase().includes('essential things')) && isFirstChapter) {
      return `${closingOl}\n<div class="my-12 border-t border-base-200"></div>\n${h2Tag}`;
    }
    return match;
  });
  
  // Créer un map des IDs pour éviter les doublons
  const idMap = new Map<string, number>();
  
  // Créer un map des IDs depuis la TOC pour garantir la cohérence
  const tocIdMap = new Map<string, string>();
  for (const item of toc) {
    tocIdMap.set(item.title.toLowerCase().trim(), item.id);
    if (item.children) {
      for (const child of item.children) {
        tocIdMap.set(child.title.toLowerCase().trim(), child.id);
      }
    }
  }
  
  // Ajouter des IDs aux h2
  processed = processed.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, content) => {
    const title = content.replace(/<[^>]*>/g, '').trim();
    if (title.toLowerCase().includes('table of contents')) {
      return ''; // Supprimer la table des matières originale
    }
    
    // Utiliser l'ID de la TOC si disponible, sinon générer
    let id = tocIdMap.get(title.toLowerCase().trim());
    if (!id) {
      id = generateId(title);
      const count = idMap.get(id) || 0;
      idMap.set(id, count + 1);
      if (count > 0) {
        id = `${id}-${count}`;
      }
    }
    
    return `<h2 id="${id}" class="scroll-mt-24">${content}</h2>`;
  });
  
  // Ajouter des IDs aux h3
  processed = processed.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (match, content) => {
    const title = content.replace(/<[^>]*>/g, '').trim();
    
    // Utiliser l'ID de la TOC si disponible, sinon générer
    let id = tocIdMap.get(title.toLowerCase().trim());
    if (!id) {
      id = generateId(title);
      const count = idMap.get(id) || 0;
      idMap.set(id, count + 1);
      if (count > 0) {
        id = `${id}-${count}`;
      }
    }
    
    return `<h3 id="${id}" class="scroll-mt-24">${content}</h3>`;
  });
  
  // Nettoyer les références aux fichiers CSS externes
  processed = processed.replace(/<link[^>]*>/gi, '');
  
  // Nettoyer les balises script si présentes
  processed = processed.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Traiter les liens selon les règles spécifiées
  processed = await processLinks(processed);
  
  return processed.trim();
}

/**
 * Extrait la table des matières depuis le markdown
 */
function extractTableOfContentsFromMarkdown(markdown: string): TableOfContentsItem[] {
  const toc: TableOfContentsItem[] = [];
  const h2Regex = /^##\s+(.+)$/gm;
  const h3Regex = /^###\s+(.+)$/gm;
  
  const headings: Array<{ level: number; title: string; position: number }> = [];
  
  let match;
  while ((match = h2Regex.exec(markdown)) !== null) {
    const title = match[1].trim();
    if (title && !title.toLowerCase().includes('table of contents')) {
      headings.push({ level: 2, title, position: match.index });
    }
  }
  
  while ((match = h3Regex.exec(markdown)) !== null) {
    const title = match[1].trim();
    if (title) {
      headings.push({ level: 3, title, position: match.index });
    }
  }
  
  // Trier par position et construire la structure hiérarchique
  headings.sort((a, b) => a.position - b.position);
  
  let currentH2: TableOfContentsItem | null = null;
  for (const heading of headings) {
    const id = generateId(heading.title);
    
    if (heading.level === 2) {
      currentH2 = { id, title: heading.title, level: 2, children: [] };
      toc.push(currentH2);
    } else if (heading.level === 3 && currentH2) {
      currentH2.children = currentH2.children || [];
      currentH2.children.push({ id, title: heading.title, level: 3 });
    }
  }
  
  return toc;
}

/**
 * Ajoute des IDs aux titres dans le markdown HTML généré par marked
 * Les IDs sont ajoutés après le rendu HTML pour compatibilité avec marked
 */
export function addIdsToRenderedHtml(html: string, toc: TableOfContentsItem[]): string {
  let processed = html;
  
  // Créer un map des IDs depuis la TOC
  const tocIdMap = new Map<string, string>();
  for (const item of toc) {
    tocIdMap.set(item.title.toLowerCase().trim(), item.id);
    if (item.children) {
      for (const child of item.children) {
        tocIdMap.set(child.title.toLowerCase().trim(), child.id);
      }
    }
  }
  
  // Ajouter des IDs aux h2
  processed = processed.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (match, content) => {
    const title = content.replace(/<[^>]*>/g, '').trim();
    if (title.toLowerCase().includes('table of contents')) {
      return '';
    }
    const id = tocIdMap.get(title.toLowerCase()) || generateId(title);
    return `<h2 id="${id}" class="scroll-mt-24">${content}</h2>`;
  });
  
  // Ajouter des IDs aux h3
  processed = processed.replace(/<h3[^>]*>(.*?)<\/h3>/gi, (match, content) => {
    const title = content.replace(/<[^>]*>/g, '').trim();
    const id = tocIdMap.get(title.toLowerCase()) || generateId(title);
    return `<h3 id="${id}" class="scroll-mt-24">${content}</h3>`;
  });
  
  return processed;
}

/**
 * Charge le contenu markdown du guide depuis public/guide/index.md
 * Retourne le contenu markdown avec IDs et la table des matières
 */
export async function loadGuideContent(): Promise<{
  content: string;
  tableOfContents: TableOfContentsItem[];
}> {
  try {
    // Essayer d'abord le markdown
    const guideMdPath = path.join(projectRoot, 'public', 'guide', 'index.md');
    
    try {
      await fs.access(guideMdPath);
      const markdownContent = await fs.readFile(guideMdPath, 'utf-8');
      
      // Extraire la table des matières depuis le markdown brut
      const toc = extractTableOfContentsFromMarkdown(markdownContent);
      
      // Retourner le markdown brut (les IDs seront ajoutés après le rendu HTML)
      return {
        content: markdownContent,
        tableOfContents: toc,
      };
    } catch {
      // Fallback vers HTML si markdown n'existe pas
      console.warn('⚠️  Markdown non trouvé, utilisation du HTML en fallback');
      const guidePath = path.join(projectRoot, 'guide.html');
      
      try {
        await fs.access(guidePath);
      } catch {
        return { content: '', tableOfContents: [] };
      }
      
      const htmlContent = await fs.readFile(guidePath, 'utf-8');
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (!bodyMatch) {
        return { content: htmlContent.trim(), tableOfContents: [] };
      }
      
      let bodyContent = bodyMatch[1];
      const toc = extractTableOfContents(bodyContent);
      const processedContent = await processGuideContent(bodyContent, toc);
      
      return {
        content: processedContent,
        tableOfContents: toc,
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement du guide:', error);
    return { content: '', tableOfContents: [] };
  }
}
