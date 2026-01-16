/**
 * Script pour nettoyer le frontmatter des articles de news en base de données
 * 
 * Usage:
 *   npx tsx scripts/clean-news-frontmatter.ts           # Mode dry-run (prévisualisation)
 *   npx tsx scripts/clean-news-frontmatter.ts --apply  # Applique les modifications
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * Nettoie le contenu en supprimant le frontmatter s'il est présent
 * Copie de la fonction depuis news-loader.ts pour éviter les dépendances Astro
 */
function cleanContent(content: string): string {
  if (!content) return content;
  
  // Nettoyer d'abord les espaces en début/fin
  let cleaned = content.trim();
  
  // Pattern principal: frontmatter YAML standard
  // Format: ---\n...frontmatter...\n---\ncontenu
  // Utiliser un regex plus permissif qui gère les retours à la ligne de différentes façons
  const frontmatterPattern = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  let match = cleaned.match(frontmatterPattern);
  
  if (match) {
    const frontmatterText = match[1];
    const body = match[2];
    
    // Vérifier que c'est bien un frontmatter (contient au moins une clé: valeur)
    if (frontmatterText.includes(':')) {
      return body.trim();
    }
  }
  
  // Pattern alternatif: frontmatter avec espaces avant
  const frontmatterPattern2 = /^\s*---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  match = cleaned.match(frontmatterPattern2);
  
  if (match) {
    const frontmatterText = match[1];
    const body = match[2];
    
    if (frontmatterText.includes(':')) {
      return body.trim();
    }
  }
  
  // Pattern de secours: chercher n'importe où dans le contenu
  const frontmatterPattern3 = /---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  match = cleaned.match(frontmatterPattern3);
  
  if (match) {
    const frontmatterText = match[1];
    const body = match[2];
    
    // Vérifier que c'est bien un frontmatter (contient au moins une clé: valeur)
    // et que le frontmatter n'est pas trop long (max 2000 caractères pour éviter les faux positifs)
    if (frontmatterText.includes(':') && frontmatterText.length < 2000) {
      return body.trim();
    }
  }
  
  return cleaned;
}

const DRY_RUN = !process.argv.includes('--apply');

async function main() {
  console.log(DRY_RUN ? '🔍 Mode DRY-RUN (prévisualisation uniquement)' : '⚠️  Mode APPLY (modifications réelles)');
  console.log('');

  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE environment variables');
    console.error('   Required: PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  console.log('📥 Chargement des articles depuis Supabase...');
  
  // Charger tous les articles (y compris les drafts pour être complet)
  const { data: articles, error: fetchError } = await supabaseAdmin
    .from('news')
    .select('id, slug, title, content')
    .not('content', 'is', null);

  if (fetchError) {
    console.error('❌ Erreur lors du chargement:', fetchError.message);
    process.exit(1);
  }

  if (!articles || articles.length === 0) {
    console.log('✅ Aucun article trouvé');
    return;
  }

  console.log(`📊 ${articles.length} articles trouvés\n`);

  const articlesToClean: Array<{ id: string; slug: string; title: string; oldContent: string; newContent: string }> = [];

  // Analyser chaque article
  for (const article of articles) {
    if (!article.content) continue;

    const cleaned = cleanContent(article.content);
    
    // Si le contenu a changé après nettoyage, c'est qu'il y avait du frontmatter
    if (cleaned !== article.content.trim()) {
      articlesToClean.push({
        id: article.id,
        slug: article.slug,
        title: article.title || 'Sans titre',
        oldContent: article.content.substring(0, 200) + (article.content.length > 200 ? '...' : ''),
        newContent: cleaned.substring(0, 200) + (cleaned.length > 200 ? '...' : ''),
      });
    }
  }

  if (articlesToClean.length === 0) {
    console.log('✅ Aucun article ne contient de frontmatter à nettoyer');
    return;
  }

  console.log(`⚠️  ${articlesToClean.length} article(s) contiennent du frontmatter:\n`);

  // Afficher les articles qui seront modifiés
  articlesToClean.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title} (${article.slug})`);
    console.log(`   ID: ${article.id}`);
    console.log(`   Avant: ${article.oldContent.replace(/\n/g, ' ')}`);
    console.log(`   Après: ${article.newContent.replace(/\n/g, ' ')}`);
    console.log('');
  });

  if (DRY_RUN) {
    console.log('💡 Pour appliquer les modifications, exécutez:');
    console.log('   npx tsx scripts/clean-news-frontmatter.ts --apply');
    return;
  }

  // Mode APPLY: mettre à jour les articles
  console.log('🔄 Application des modifications...\n');
  let updated = 0;
  let errors = 0;

  for (const article of articlesToClean) {
    const originalArticle = articles.find(a => a.id === article.id);
    if (!originalArticle) continue;

    const cleaned = cleanContent(originalArticle.content);

    const { error: updateError } = await supabaseAdmin
      .from('news')
      .update({ content: cleaned })
      .eq('id', article.id);

    if (updateError) {
      console.error(`❌ Erreur lors de la mise à jour de ${article.slug}:`, updateError.message);
      errors++;
    } else {
      console.log(`✅ Nettoyé: ${article.slug}`);
      updated++;
    }
  }

  console.log(`\n✨ Terminé! ${updated} article(s) mis à jour, ${errors} erreur(s)`);
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
