/**
 * Script d'export des News depuis Supabase vers Markdown statique
 * 
 * Ce script :
 * 1. Récupère les articles publiés non encore exportés (exported_to_static = false)
 * 2. Télécharge les images depuis Supabase Storage
 * 3. Crée les fichiers Markdown dans /public/news/[slug]/
 * 4. Marque les articles comme exportés (exported_to_static = true)
 * 
 * Usage:
 *   npm run export-news
 *   ou
 *   tsx scripts/export-news-to-markdown.ts
 */

import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Créer le client Supabase directement avec process.env (pour scripts Node.js)
function getSupabaseAdmin() {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_name: string | null;
  author_email: string | null;
  status: string;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Télécharge une image depuis Supabase Storage
 */
async function downloadImage(
  supabase: any,
  imageUrl: string,
  destinationPath: string
): Promise<string | null> {
  try {
    // Si l'URL est déjà locale ou externe, on la copie ou on la télécharge
    if (imageUrl.startsWith('http')) {
      // URL externe ou Supabase Storage
      if (imageUrl.includes('supabase.co/storage')) {
        // Extraire le chemin depuis l'URL Supabase Storage
        const urlParts = imageUrl.split('/storage/v1/object/public/');
        if (urlParts.length === 2) {
          const [bucket, ...filePathParts] = urlParts[1].split('/');
          const filePath = filePathParts.join('/');
          
          const { data, error } = await supabase.storage
            .from(bucket)
            .download(filePath);
          
          if (error) {
            console.error(`❌ Erreur téléchargement image ${imageUrl}:`, error);
            return null;
          }
          
          // Convertir blob en buffer
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          await fs.writeFile(destinationPath, buffer);
          console.log(`✅ Image téléchargée: ${destinationPath}`);
          
          // Retourner le chemin relatif depuis /public
          return path.relative(path.join(projectRoot, 'public'), destinationPath);
        }
      } else {
        // URL externe, on la télécharge
        const response = await fetch(imageUrl);
        if (!response.ok) {
          console.error(`❌ Impossible de télécharger ${imageUrl}: ${response.statusText}`);
          return null;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(destinationPath, buffer);
        console.log(`✅ Image externe téléchargée: ${destinationPath}`);
        
        return path.relative(path.join(projectRoot, 'public'), destinationPath);
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erreur lors du téléchargement de l'image ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Crée le fichier Markdown pour un article
 */
async function createMarkdownFile(
  article: NewsArticle,
  imagePath: string | null
): Promise<void> {
  const newsDir = path.join(projectRoot, 'public', 'news', article.slug);
  
  // Créer le dossier si nécessaire
  await fs.mkdir(newsDir, { recursive: true });
  
  // Préparer le frontmatter
  const frontmatter: Record<string, any> = {
    title: article.title,
    slug: article.slug,
    published_at: article.published_at || article.created_at,
    featured: article.featured,
  };
  
  if (article.excerpt) {
    frontmatter.excerpt = article.excerpt;
  }
  
  if (article.author_name) {
    frontmatter.author_name = article.author_name;
  }
  
  if (article.author_email) {
    frontmatter.author_email = article.author_email;
  }
  
  if (imagePath) {
    frontmatter.featured_image = path.basename(imagePath);
  }
  
  // Générer le contenu Markdown
  const frontmatterString = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: "${value.replace(/"/g, '\\"')}"`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
  
  const markdownContent = `---\n${frontmatterString}\n---\n\n${article.content}\n`;
  
  // Écrire le fichier index.md
  const indexPath = path.join(newsDir, 'index.md');
  await fs.writeFile(indexPath, markdownContent, 'utf-8');
  console.log(`✅ Markdown créé: ${indexPath}`);
}

/**
 * Exporte un article vers Markdown
 */
async function exportArticle(
  supabase: any,
  article: NewsArticle
): Promise<boolean> {
  try {
    console.log(`\n📰 Export de l'article: ${article.title} (${article.slug})`);
    
    let imagePath: string | null = null;
    
    // Télécharger l'image si présente
    if (article.featured_image_url) {
      const newsDir = path.join(projectRoot, 'public', 'news', article.slug);
      await fs.mkdir(newsDir, { recursive: true });
      
      // Déterminer l'extension depuis l'URL
      const urlParts = article.featured_image_url.split('.');
      const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'jpg';
      const imageFileName = `featured-image.${extension}`;
      const imageDestination = path.join(newsDir, imageFileName);
      
      imagePath = await downloadImage(supabase, article.featured_image_url, imageDestination);
    }
    
    // Créer le fichier Markdown
    await createMarkdownFile(article, imagePath);
    
    // Marquer comme exporté dans Supabase
    const { error: updateError } = await supabase
      .from('news')
      .update({ exported_to_static: true })
      .eq('id', article.id);
    
    if (updateError) {
      console.error(`❌ Erreur lors de la mise à jour du flag exported_to_static:`, updateError);
      return false;
    }
    
    console.log(`✅ Article exporté avec succès: ${article.slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'export de l'article ${article.slug}:`, error);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Début de l\'export des News vers Markdown...\n');
  
  const supabaseAdmin = getSupabaseAdmin();
  
  // Récupérer les articles publiés non encore exportés
  const { data: articles, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('status', 'published')
    .eq('hidden', false)
    .eq('exported_to_static', false)
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('❌ Erreur lors de la récupération des articles:', error);
    process.exit(1);
  }
  
  if (!articles || articles.length === 0) {
    console.log('✅ Aucun article à exporter.');
    return;
  }
  
  console.log(`📊 ${articles.length} article(s) à exporter.\n`);
  
  // Créer le client Supabase pour Storage (nécessite les credentials)
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables d\'environnement manquantes: PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
    console.error('   Assurez-vous d\'avoir un fichier .env avec ces variables.');
    process.exit(1);
  }
  
  const supabaseStorage = createClient(supabaseUrl, supabaseServiceKey);
  
  // Exporter chaque article
  let successCount = 0;
  let errorCount = 0;
  
  for (const article of articles) {
    const success = await exportArticle(supabaseStorage, article);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`\n📊 Résumé de l'export:`);
  console.log(`   ✅ Réussis: ${successCount}`);
  console.log(`   ❌ Échecs: ${errorCount}`);
  console.log(`   📝 Total: ${articles.length}`);
  
  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} article(s) n'ont pas pu être exportés. Vérifiez les logs ci-dessus.`);
    process.exit(1);
  }
  
  console.log('\n✅ Export terminé avec succès !');
}

// Exécuter le script
main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
