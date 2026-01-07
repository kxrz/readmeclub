/**
 * Script pour convertir guide.html en markdown propre
 * avec traitement des liens selon les règles spécifiées
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/**
 * Trouve une ressource par son ancien record ID ou URL
 */
async function findResourceByOldUrl(oldUrl: string): Promise<string | null> {
  if (!supabase) return null;
  
  try {
    const recordMatch = oldUrl.match(/record=([^&]+)/);
    if (!recordMatch) return null;
    
    const recordId = recordMatch[1];
    
    const { data: resources } = await supabase
      .from('resources')
      .select('id, external_link, description')
      .eq('status', 'approved')
      .eq('hidden', false);
    
    if (!resources) return null;
    
    const matching = resources.find(r => 
      r.external_link?.includes(recordId) || 
      r.description?.includes(recordId) ||
      r.external_link?.includes(oldUrl) ||
      r.external_link?.includes(`ddl?record=${recordId}`)
    );
    
    return matching?.id || null;
  } catch (error) {
    console.error('Erreur lors de la recherche de ressource:', error);
    return null;
  }
}

/**
 * Convertit HTML en Markdown propre
 */
function htmlToMarkdown(html: string): string {
  let md = html;
  
  // Nettoyer les entités HTML
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&mdash;/g, '—');
  md = md.replace(/&ndash;/g, '–');
  
  // Supprimer les scripts et styles
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<link[^>]*>/gi, '');
  
  // Supprimer le titre principal et la TOC
  md = md.replace(/<h1[^>]*>.*?Xteink X4 Complete Community Guide.*?<\/h1>/gi, '');
  md = md.replace(/<h2[^>]*>.*?table of contents.*?<\/h2>/gi, '');
  md = md.replace(/<h2[^>]*>.*?Table of Contents.*?<\/h2>/gi, '');
  md = md.replace(/<ol[^>]*>\s*<li[^>]*>.*?Setup and Configuration.*?<\/li>[\s\S]*?<\/ol>/gi, '');
  
  // Titres
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  
  // Paragraphes
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Convertir toutes les listes (ordonnées et non ordonnées) en listes non ordonnées
  // D'abord, traiter les listes ordonnées et non ordonnées de manière unifiée
  // On remplace <ol> et <ul> par rien, et </ol> et </ul> par \n
  md = md.replace(/<ol[^>]*>/gi, '');
  md = md.replace(/<ul[^>]*>/gi, '');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  
  // Traiter tous les <li> (qu'ils soient dans <ol> ou <ul>) comme des listes non ordonnées
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, (match, content) => {
    const cleanContent = content.trim();
    return `- ${cleanContent}\n`;
  });
  
  // Traiter les liens dans les balises strong/b/em/i AVANT de convertir ces balises
  // Pattern: <strong>text avec <a href="url">url</a></strong> doit devenir **text avec [url](url)**
  // On traite d'abord les liens à l'intérieur des balises de formatage
  md = md.replace(/<(strong|b|em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (match, tag, content) => {
    // Convertir les liens <a> dans le contenu
    let processedContent = content.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    // Convertir les URLs nues en liens markdown dans le contenu (mais pas celles déjà dans des liens)
    processedContent = processedContent.replace(/(?<!\]\()(https?:\/\/[^\s<\)]+)/g, '[$1]($1)');
    return `<${tag}>${processedContent}</${tag}>`;
  });
  
  // Maintenant convertir les balises de formatage en markdown
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, (match, content) => {
    const cleanContent = content.trim();
    return `**${cleanContent}**`;
  });
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, (match, content) => {
    const cleanContent = content.trim();
    return `**${cleanContent}**`;
  });
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, (match, content) => {
    const cleanContent = content.trim();
    return `*${cleanContent}*`;
  });
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, (match, content) => {
    const cleanContent = content.trim();
    return `*${cleanContent}*`;
  });
  
  // Traiter les liens restants (hors balises de formatage)
  md = md.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n');
  
  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
  
  // Séparateurs
  md = md.replace(/<hr[^>]*>/gi, '---\n');
  
  // Nettoyer les balises restantes
  md = md.replace(/<[^>]+>/g, '');
  
  // Nettoyer les espaces multiples et lignes vides
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/[ \t]+/g, ' ');
  md = md.replace(/^\s+/gm, '');
  
  // Ajouter un séparateur après le TL;DR
  md = md.replace(/(\d+\.\s+For questions.*?)\n\n(##\s+\d+\.\s+Setup)/s, '$1\n\n---\n\n$2');
  
  // Convertir toutes les listes ordonnées restantes en listes non ordonnées
  // Pattern: lignes qui commencent par "1. " ou "1." suivi d'un espace
  md = md.replace(/^\d+\.\s+/gm, '- ');
  
  return md.trim();
}

/**
 * Traite les liens selon les règles spécifiées
 */
async function processLinks(markdown: string): Promise<string> {
  let processed = markdown;
  
  // 1. Remplacer les anciens domaines par readme.club
  processed = processed.replace(/https:\/\/xteink-community-hub\.replit\.app/g, 'https://readme.club');
  processed = processed.replace(/https:\/\/xteink\.dontthinkjustbuild\.com/g, 'https://readme.club');
  
  // 2. Traiter les URLs avec ddl?record= pour les convertir en liens vers ressources
  const recordUrlRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+ddl\?record=([^\)]+))\)/gi;
  const recordMatches = Array.from(processed.matchAll(recordUrlRegex));
  
  for (const match of recordMatches) {
    const linkText = match[1];
    const fullUrl = match[2];
    const recordId = match[3];
    
    const resourceId = await findResourceByOldUrl(fullUrl);
    if (resourceId) {
      processed = processed.replace(match[0], `[${linkText}](/resources/${resourceId})`);
    } else {
      processed = processed.replace(match[0], `[${linkText}](/resources)`);
    }
  }
  
  // 3. Traiter les URLs nues avec ddl?record=
  const bareUrlRegex = /(https?:\/\/[^\s\)]+ddl\?record=([^\)\s]+))/gi;
  const bareMatches = Array.from(processed.matchAll(bareUrlRegex));
  
  for (const match of bareMatches) {
    const fullUrl = match[0];
    const recordId = match[1];
    
    const resourceId = await findResourceByOldUrl(fullUrl);
    if (resourceId) {
      processed = processed.replace(fullUrl, `/resources/${resourceId}`);
    } else {
      processed = processed.replace(fullUrl, '/resources');
    }
  }
  
  // 4. Traiter "URL: https://...ddl?record=XXX" -> lien vers ressource
  const urlPatternRegex = /URL:\s*(https?:\/\/[^\s\)]+ddl\?record=([^\)\s]+))/gi;
  const urlMatches = Array.from(processed.matchAll(urlPatternRegex));
  
  for (const match of urlMatches) {
    const fullUrl = match[1];
    const recordId = match[2];
    
    const resourceId = await findResourceByOldUrl(fullUrl);
    if (resourceId) {
      processed = processed.replace(match[0], `🔗 [Resources](/resources/${resourceId})`);
    } else {
      processed = processed.replace(match[0], `🔗 [Resources](/resources)`);
    }
  }
  
  // 4b. Traiter "URL: /resources" -> "🔗 Resources" avec lien
  processed = processed.replace(/URL:\s*\/resources/gi, '🔗 [Resources](/resources)');
  
  // 4c. Traiter "URL: /resources/..." -> "🔗 Resources" avec lien vers la ressource spécifique
  processed = processed.replace(/URL:\s*\/resources\/([^\s\)]+)/gi, '🔗 [Resources](/resources/$1)');
  
  // 4d. Traiter aussi les patterns avec "**URL:**" ou autres variantes
  processed = processed.replace(/\*\*URL:\*\*\s*\/resources/gi, '🔗 [Resources](/resources)');
  processed = processed.replace(/\*\*URL:\*\*\s*\/resources\/([^\s\)]+)/gi, '🔗 [Resources](/resources/$1)');
  
  // 5. Rendre les URLs cliquables (si pas déjà dans un lien markdown)
  // Mais éviter de casser le formatage markdown existant
  // Protéger d'abord les URLs déjà dans des liens markdown ou dans du gras
  const protectedUrls = new Set<string>();
  
  // Marquer les URLs déjà dans des liens
  processed.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text, url) => {
    protectedUrls.add(url);
    return match;
  });
  
  // Marquer les URLs dans du gras
  processed.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
    const urlMatches = content.match(/(https?:\/\/[^\s\)]+)/g);
    if (urlMatches) {
      urlMatches.forEach(url => protectedUrls.add(url));
    }
    return match;
  });
  
  // Rendre les URLs restantes cliquables
  processed = processed.replace(/(https?:\/\/[^\s\)]+)/g, (url, offset) => {
    // Si déjà protégée, ne pas modifier
    if (protectedUrls.has(url)) return url;
    
    // Vérifier le contexte pour éviter de casser le formatage
    const before = processed.substring(Math.max(0, offset - 5), offset);
    const after = processed.substring(offset + url.length, Math.min(processed.length, offset + url.length + 5));
    
    // Si dans du gras, ne pas modifier
    if (before.includes('**') || after.includes('**')) {
      return url;
    }
    
    return `[${url}](${url})`;
  });
  
  // 6. Rendre les emails cliquables
  processed = processed.replace(/(?<!mailto:)([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, (email) => {
    if (processed.indexOf(`mailto:${email}`) !== -1) return email;
    return `[${email}](mailto:${email})`;
  });
  
  // 7. Lier "iamkxrz" vers Reddit
  processed = processed.replace(/\biamkxrz\b(?!.*reddit\.com)/gi, '[iamkxrz](https://reddit.com/user/iamkxrz)');
  
  return processed;
}

/**
 * Convertit guide.html en markdown propre
 */
async function convertGuideToMarkdown() {
  try {
    const guideHtmlPath = path.join(projectRoot, 'guide.html');
    const guideMdPath = path.join(projectRoot, 'public', 'guide', 'index.md');
    
    console.log('📖 Conversion de guide.html en markdown...');
    
    // Lire le HTML
    const htmlContent = await fs.readFile(guideHtmlPath, 'utf-8');
    
    // Extraire le body
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) {
      console.error('❌ Impossible de trouver le body dans guide.html');
      return;
    }
    
    let bodyContent = bodyMatch[1];
    
    // Convertir en markdown
    let markdown = htmlToMarkdown(bodyContent);
    
    // Traiter les liens
    console.log('🔗 Traitement des liens...');
    markdown = await processLinks(markdown);
    
    // Créer le dossier si nécessaire
    const guideDir = path.dirname(guideMdPath);
    await fs.mkdir(guideDir, { recursive: true });
    
    // Écrire le markdown
    await fs.writeFile(guideMdPath, markdown, 'utf-8');
    
    console.log('✅ Guide converti en markdown:', guideMdPath);
    console.log(`📊 Taille: ${(markdown.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error);
    process.exit(1);
  }
}

convertGuideToMarkdown();
