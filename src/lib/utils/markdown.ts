import { marked } from 'marked';

/**
 * Configure marked for general use
 */
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Renders markdown to HTML
 */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown);
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
