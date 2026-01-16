/**
 * Script pour marquer les articles de news existants en Markdown comme ready_for_static
 * 
 * Usage: npx tsx scripts/mark-existing-static-news.ts
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function getExistingMarkdownSlugs(): Promise<string[]> {
  const newsDir = path.join(projectRoot, 'public', 'news');
  
  try {
    await fs.access(newsDir);
  } catch {
    console.log('No public/news directory found');
    return [];
  }
  
  const entries = await fs.readdir(newsDir, { withFileTypes: true });
  const slugs: string[] = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const indexPath = path.join(newsDir, entry.name, 'index.md');
      try {
        await fs.access(indexPath);
        slugs.push(entry.name);
      } catch {
        // Pas de index.md, on ignore
      }
    }
  }
  
  return slugs;
}

async function main() {
  console.log('🔍 Scanning for existing Markdown news articles...');
  
  const slugs = await getExistingMarkdownSlugs();
  console.log(`Found ${slugs.length} Markdown articles:`, slugs);
  
  if (slugs.length === 0) {
    console.log('No Markdown articles found. Exiting.');
    return;
  }
  
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE environment variables');
    process.exit(1);
  }
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('\n📝 Updating Supabase...');
  let updated = 0;
  let notFound = 0;
  
  for (const slug of slugs) {
    const { data, error } = await supabaseAdmin
      .from('news')
      .update({ ready_for_static: true })
      .eq('slug', slug)
      .select('id');
    
    if (error) {
      console.error(`❌ Error updating ${slug}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Marked ${slug} as ready_for_static`);
      updated++;
    } else {
      console.log(`⚠️  Article ${slug} not found in Supabase (might be already static-only)`);
      notFound++;
    }
  }
  
  console.log(`\n✨ Done! Updated: ${updated}, Not found: ${notFound}`);
}

main().catch(console.error);
