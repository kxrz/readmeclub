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
 * Renders markdown to HTML (pour resources - sans configuration spéciale)
 * Utilise l'instance globale de marked avec configuration simple
 * Évite marked.parse() qui pourrait causer des problèmes de parsing
 */
export function renderMarkdown(markdown: string): string {
  // Réinitialiser les options pour éviter les conflits avec configureMarked
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  // Utiliser marked directement sans .parse() pour éviter les problèmes
  const result = marked(markdown);
  return typeof result === 'string' ? result : String(result);
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
