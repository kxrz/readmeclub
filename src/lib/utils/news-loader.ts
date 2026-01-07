/**
 * Chargeur de News depuis fichiers Markdown statiques
 * 
 * Ce module charge les articles de news depuis /public/news/[slug]/index.md
 * avec fallback vers Supabase si le fichier n'existe pas (mode dégradé).
 */

import { getSupabaseAdmin } from '../supabase/admin';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Parser simple de frontmatter (évite dépendance externe)
function parseFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  const frontmatter: Record<string, any> = {};
  
  // Parser simple ligne par ligne
  for (const line of frontmatterText.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Enlever les guillemets
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Convertir les booléens
    if (value === 'true') {
      frontmatter[key] = true;
    } else if (value === 'false') {
      frontmatter[key] = false;
    } else {
      frontmatter[key] = value;
    }
  }
  
  return { frontmatter, body };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

export interface NewsArticle {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string | null;
  author_email: string | null;
  published_at: string;
  featured: boolean;
}

/**
 * Charge un article depuis un fichier Markdown
 */
async function loadArticleFromMarkdown(slug: string): Promise<NewsArticle | null> {
  try {
    const articlePath = path.join(projectRoot, 'public', 'news', slug, 'index.md');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(articlePath);
    } catch {
      return null; // Fichier n'existe pas
    }
    
    const fileContent = await fs.readFile(articlePath, 'utf-8');
    const { frontmatter, body: content } = parseFrontmatter(fileContent);
    
    // Construire le chemin de l'image si présente
    let featuredImage: string | null = null;
    if (frontmatter.featured_image) {
      featuredImage = `/news/${slug}/${frontmatter.featured_image}`;
    }
    
    return {
      title: frontmatter.title || '',
      slug: frontmatter.slug || slug,
      excerpt: frontmatter.excerpt || null,
      content: content.trim(),
      featured_image: featuredImage,
      author_name: frontmatter.author_name || null,
      author_email: frontmatter.author_email || null,
      published_at: frontmatter.published_at || '',
      featured: frontmatter.featured || false,
    };
  } catch (error) {
    console.error(`Erreur lors du chargement de l'article ${slug}:`, error);
    return null;
  }
}

/**
 * Charge tous les articles depuis les fichiers Markdown
 */
export async function loadAllNewsArticles(): Promise<NewsArticle[]> {
  try {
    const newsDir = path.join(projectRoot, 'public', 'news');
    
    // Vérifier si le dossier existe
    try {
      await fs.access(newsDir);
    } catch {
      return []; // Dossier n'existe pas, retourner tableau vide
    }
    
    const entries = await fs.readdir(newsDir, { withFileTypes: true });
    const articles: NewsArticle[] = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const article = await loadArticleFromMarkdown(entry.name);
        if (article) {
          articles.push(article);
        }
      }
    }
    
    // Trier par date de publication (plus récent en premier)
    // Utiliser comparaison de chaînes ISO pour éviter Date.parse()
    articles.sort((a, b) => {
      const dateA = a.published_at || '';
      const dateB = b.published_at || '';
      // Les dates ISO sont comparables directement comme chaînes
      if (dateA < dateB) return 1;
      if (dateA > dateB) return -1;
      return 0;
    });
    
    return articles;
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    return [];
  }
}

/**
 * Trie les articles par date (plus récent en premier)
 * Utilise comparaison de chaînes ISO pour éviter Date.parse()
 */
export function sortNewsByDate(articles: NewsArticle[]): NewsArticle[] {
  return articles.sort((a, b) => {
    const dateA = a.published_at || '';
    const dateB = b.published_at || '';
    // Les dates ISO sont comparables directement comme chaînes
    if (dateA < dateB) return 1;
    if (dateA > dateB) return -1;
    return 0;
  });
}

/**
 * Charge un article par slug avec fallback Supabase
 */
export async function loadNewsArticle(slug: string): Promise<NewsArticle | null> {
  // Essayer d'abord depuis Markdown
  const article = await loadArticleFromMarkdown(slug);
  if (article) {
    return article;
  }
  
  // Fallback vers Supabase (mode dégradé)
  console.warn(`⚠️  Article ${slug} non trouvé dans Markdown, fallback vers Supabase`);
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featured_image: data.featured_image_url,
      author_name: data.author_name,
      author_email: data.author_email,
      published_at: data.published_at || data.created_at,
      featured: data.featured,
    };
  } catch (error) {
    console.error(`Erreur lors du fallback Supabase pour ${slug}:`, error);
    return null;
  }
}
