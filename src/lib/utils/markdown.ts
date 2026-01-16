/**
 * Configuration de Marked pour le rendu Markdown
 * avec support des liens externes (target="_blank" + UTM)
 */

import { marked } from 'marked';

/**
 * Configure marked avec un renderer personnalisé pour les liens externes
 */
export function configureMarked() {
  const renderer = new marked.Renderer();
  const defaultLinkRenderer = renderer.link.bind(renderer);

  // Custom link renderer to add target="_blank" and UTM to external links
  renderer.link = function(href, title, text) {
    // Use default renderer first to get proper HTML
    const defaultHtml = defaultLinkRenderer(href, title, text);
    
    // If href is invalid, return default
    if (!href || typeof href !== 'string' || href.trim() === '' || href === 'undefined') {
      return defaultHtml;
    }
    
    // Check if external link
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    
    if (isExternal) {
      try {
        // Add UTM parameters to external links
        // Éviter url.toString() qui contient 't' - utiliser construction manuelle
        const urlObj = new URL(href);
        urlObj.searchParams.set('utm_source', 'readme.club');
        urlObj.searchParams.set('utm_medium', 'referral');
        // Construire l'URL manuellement pour éviter toString()
        const protocol = urlObj.protocol;
        const host = urlObj.host;
        const pathname = urlObj.pathname;
        const search = urlObj.search;
        const hash = urlObj.hash;
        const finalHref = protocol + '//' + host + pathname + search + hash;
        
        // Modify the default HTML to add target="_blank" and update href
        return defaultHtml
          .replace(/href="[^"]*"/, 'href="' + finalHref + '"')
          .replace(/<a /, '<a target="_blank" rel="noopener noreferrer" ');
      } catch (e) {
        // If URL parsing fails, just add target="_blank" to default HTML
        return defaultHtml.replace(/<a /, '<a target="_blank" rel="noopener noreferrer" ');
      }
    }
    
    // Internal links - return default HTML unchanged
    return defaultHtml;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer,
  });

  return marked;
}

/**
 * Parse markdown avec la configuration par défaut (pour news avec liens externes)
 */
export function parseMarkdown(content: string): string {
  const markedInstance = configureMarked();
  return markedInstance.parse(content) as string;
}

/**
 * Renders markdown to HTML avec tous les liens qui s'ouvrent dans un nouvel onglet
 * Utilise un renderer personnalisé pour ajouter target="_blank" à tous les liens
 */
export function renderMarkdown(markdown: string): string {
  // Nettoyer le frontmatter si présent (sécurité supplémentaire)
  let cleanedMarkdown = markdown.trim();
  
  // Pattern 1: frontmatter standard au début
  const frontmatterPattern1 = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  let match = cleanedMarkdown.match(frontmatterPattern1);
  if (match && match[1].includes(':')) {
    cleanedMarkdown = match[2].trim();
  }
  
  // Pattern 2: frontmatter avec espaces avant
  if (cleanedMarkdown === markdown.trim()) {
    const frontmatterPattern2 = /^\s*---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
    match = cleanedMarkdown.match(frontmatterPattern2);
    if (match && match[1].includes(':')) {
      cleanedMarkdown = match[2].trim();
    }
  }
  
  // Pattern 3: frontmatter n'importe où (dernier recours)
  if (cleanedMarkdown === markdown.trim()) {
    const frontmatterPattern3 = /---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
    match = cleanedMarkdown.match(frontmatterPattern3);
    if (match && match[1].includes(':') && match[1].length < 2000) {
      cleanedMarkdown = match[2].trim();
    }
  }
  
  // Si le markdown commence toujours par "---", essayer de supprimer manuellement
  if (cleanedMarkdown.startsWith('---')) {
    const lines = cleanedMarkdown.split('\n');
    let frontmatterEndIndex = -1;
    let foundFirstDash = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (!foundFirstDash) {
          foundFirstDash = true;
        } else {
          frontmatterEndIndex = i;
          break;
        }
      }
    }
    
    if (frontmatterEndIndex > 0) {
      cleanedMarkdown = lines.slice(frontmatterEndIndex + 1).join('\n').trim();
    }
  }
  
  const renderer = new marked.Renderer();
  const defaultLinkRenderer = renderer.link.bind(renderer);

  // Custom link renderer pour ajouter target="_blank" à tous les liens
  renderer.link = function(href, title, text) {
    // Utiliser le renderer par défaut d'abord
    const defaultHtml = defaultLinkRenderer(href, title, text);
    
    // Si href est invalide, retourner le HTML par défaut
    if (!href || typeof href !== 'string' || href.trim() === '' || href === 'undefined') {
      return defaultHtml;
    }
    
    // Ajouter target="_blank" et rel="noopener noreferrer" à tous les liens
    // Vérifier si target="_blank" n'est pas déjà présent
    if (!defaultHtml.includes('target=')) {
      return defaultHtml.replace(/<a /, '<a target="_blank" rel="noopener noreferrer" ');
    }
    
    return defaultHtml;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer,
  });

  // Utiliser marked directement avec le markdown nettoyé
  try {
    let result = marked(cleanedMarkdown);
    result = typeof result === 'string' ? result : String(result);
    
    // Vérifier que le résultat est bien du HTML (contient des balises)
    // Si ce n'est pas le cas, c'est qu'il y a eu un problème
    if (!result.includes('<') && cleanedMarkdown.length > 0) {
      console.warn('renderMarkdown: marked n\'a pas généré de HTML, réessai...');
      // Réessayer avec marked.parse si disponible
      if (typeof marked.parse === 'function') {
        result = marked.parse(cleanedMarkdown);
        result = typeof result === 'string' ? result : String(result);
      }
    }
    
    // Nettoyage final: supprimer tout frontmatter qui aurait pu être rendu en HTML
    // Chercher des patterns comme <p>---</p> ou des lignes avec des clés frontmatter
    result = result.replace(/<p>---\s*<\/p>\s*<p>([^<]*:.*?)<\/p>\s*(?:<p>([^<]*:.*?)<\/p>\s*)*(?:<p>---\s*<\/p>)/gi, '');
    result = result.replace(/<p>---[\s\S]*?---<\/p>/gi, '');
    
    return result;
  } catch (error) {
    console.error('Erreur dans renderMarkdown:', error);
    // Fallback: retourner le markdown nettoyé (sera échappé par set:html)
    return cleanedMarkdown;
  }
}

/**
 * Strips markdown syntax and returns plain text
 * Useful for previews and card descriptions
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  // Remove markdown code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Remove inline code
  text = text.replace(/`[^`]*`/g, '');
  
  // Remove markdown links but keep the text: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove images: ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
  
  // Remove headers (# ## ### etc.)
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  // Remove bold and italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Remove strikethrough
  text = text.replace(/~~([^~]+)~~/g, '$1');
  
  // Remove list markers
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Remove blockquotes
  text = text.replace(/^>\s+/gm, '');
  
  // Remove horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '');
  
  // Clean up multiple spaces and newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  
  return text.trim();
}
