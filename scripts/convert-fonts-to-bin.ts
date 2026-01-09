/**
 * Convert TTF fonts to BIN format using Lakafior's converter
 * 
 * Run: npm run convert-fonts-to-bin
 * 
 * Requirements:
 * 1. Lakafior converter must be extracted to src/lib/font-finder/bin-converter.ts
 * 2. TTF files must be in public/fonts/
 * 3. Output will be in public/fonts-bin/
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { convertTTFToBIN } from '../src/lib/font-finder/bin-converter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const fontsDir = path.join(projectRoot, 'public', 'fonts');
const binOutDir = path.join(projectRoot, 'public', 'fonts-bin');

async function convertFonts() {
  console.log('🔄 Starting font conversion (TTF → BIN)...\n');

  // Ensure output directory exists
  await fs.mkdir(binOutDir, { recursive: true });

  try {
    // Read all TTF files
    const files = await fs.readdir(fontsDir);
    const ttfFiles = files.filter(f => f.endsWith('.ttf'));

    if (ttfFiles.length === 0) {
      console.log('⚠️  No TTF files found in public/fonts/');
      console.log('   Please add TTF font files first.\n');
      return;
    }

    console.log(`📁 Found ${ttfFiles.length} TTF file(s)\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const ttfFile of ttfFiles) {
      const ttfPath = path.join(fontsDir, ttfFile);
      const binFile = ttfFile.replace(/\.ttf$/i, '.bin');
      const binPath = path.join(binOutDir, binFile);

      try {
        console.log(`  Converting: ${ttfFile} → ${binFile}...`);

        // Read TTF file (already a Node.js Buffer)
        const ttfBuffer = await fs.readFile(ttfPath);

        // Convert to BIN with default options
        // Note: These options match Lakafior's defaults
        const binBuffer = convertTTFToBIN(ttfBuffer, {
          fontSize: 28,
          charSpacing: 0,
          lineSpacing: 0,
          threshold: 127,
          shouldRenderBorder: false,
          useOpticalAlign: false,
          isVerticalFont: false,
        });

        // Write BIN file
        await fs.writeFile(binPath, Buffer.from(binBuffer));

        const stats = await fs.stat(binPath);
        console.log(`    ✅ Created: ${binFile} (${(stats.size / 1024).toFixed(2)} KB)\n`);

        successCount++;
      } catch (error: any) {
        console.error(`    ❌ Error converting ${ttfFile}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some fonts failed to convert.');
      console.log('   Make sure the Lakafior converter is properly extracted.');
    }
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run conversion
convertFonts().catch(console.error);

