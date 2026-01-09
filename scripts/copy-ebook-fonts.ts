/**
 * Copy and rename ebook-fonts to public/fonts/
 * 
 * Run: npm run copy-ebook-fonts
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDir = path.join(projectRoot, 'temp', 'fonts', 'ebook-fonts-main', 'fonts');
const targetDir = path.join(projectRoot, 'public', 'fonts');

// Mapping: ebook-fonts name → our name
// Copy all Regular fonts from core directory
const fontMapping: Record<string, string> = {
  'NV_Garamond-Regular.ttf': 'nv-garamond.ttf',
  'NV_Charter-Regular.ttf': 'nv-charter.ttf',
  'NV_Literata-Regular.ttf': 'nv-literata.ttf',
  'NV_Bitter-Regular.ttf': 'nv-bitter.ttf',
  'NV_Georsio-Regular.ttf': 'nv-georsio.ttf',
  'NV_Jost-Regular.ttf': 'nv-jost.ttf',
  'NV_LegibleNext-Regular.ttf': 'nv-legible-next.ttf',
  'NV_Membo-Regular.ttf': 'nv-membo.ttf',
  'NV_Palatium-Regular.ttf': 'nv-palatium.ttf',
  // Note: Merriweather and Crimson are not in ebook-fonts, they're Google Fonts
  // We'll use the regular versions from Google Fonts instead
};

async function copyFonts() {
  console.log('📁 Copying ebook-fonts...\n');

  // Ensure target directory exists
  await fs.mkdir(targetDir, { recursive: true });

  let copied = 0;
  let skipped = 0;

  // Check core fonts
  const coreDir = path.join(sourceDir, 'core');
  try {
    const coreFiles = await fs.readdir(coreDir);
    for (const file of coreFiles) {
      if (fontMapping[file]) {
        const source = path.join(coreDir, file);
        const target = path.join(targetDir, fontMapping[file]);
        
        try {
          await fs.copyFile(source, target);
          console.log(`  ✅ ${file} → ${fontMapping[file]}`);
          copied++;
        } catch (error: any) {
          console.error(`  ❌ Error copying ${file}:`, error.message);
        }
      }
    }
  } catch (error: any) {
    console.error('Error reading core fonts:', error.message);
  }

  // Check extra fonts
  const extraDir = path.join(sourceDir, 'extra');
  try {
    const extraFiles = await fs.readdir(extraDir);
    for (const file of extraFiles) {
      if (fontMapping[file]) {
        const source = path.join(extraDir, file);
        const target = path.join(targetDir, fontMapping[file]);
        
        try {
          await fs.copyFile(source, target);
          console.log(`  ✅ ${file} → ${fontMapping[file]}`);
          copied++;
        } catch (error: any) {
          console.error(`  ❌ Error copying ${file}:`, error.message);
        }
      }
    }
  } catch (error: any) {
    console.error('Error reading extra fonts:', error.message);
  }

  console.log(`\n📊 Summary: ${copied} fonts copied, ${skipped} skipped`);
  console.log('\n💡 Note: Google Fonts need to be downloaded manually from fonts.google.com');
}

copyFonts().catch(console.error);

