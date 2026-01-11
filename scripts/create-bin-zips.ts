/**
 * Create ZIP files for all .bin font files
 * 
 * Run: npm run create-bin-zips
 * 
 * This script:
 * 1. Reads all .bin files from public/fonts-bin/
 * 2. Creates a ZIP file for each .bin file (containing the .bin file)
 * 3. Saves ZIP files in public/fonts-bin/ with .zip extension
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const binDir = path.join(projectRoot, 'public', 'fonts-bin');

async function createBinZips() {
  console.log('🔄 Starting ZIP creation for .bin font files...\n');

  try {
    // Check if fonts-bin directory exists
    try {
      await fs.access(binDir);
    } catch {
      console.log('⚠️  Directory public/fonts-bin/ does not exist.');
      console.log('   Run "npm run convert-fonts-to-bin" first to generate .bin files.\n');
      return;
    }

    // Read all .bin files
    const files = await fs.readdir(binDir);
    const binFiles = files.filter(f => f.toLowerCase().endsWith('.bin'));

    if (binFiles.length === 0) {
      console.log('⚠️  No .bin files found in public/fonts-bin/');
      console.log('   Run "npm run convert-fonts-to-bin" first to generate .bin files.\n');
      return;
    }

    console.log(`📁 Found ${binFiles.length} .bin file(s)\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const binFile of binFiles) {
      const binPath = path.join(binDir, binFile);
      const zipFileName = binFile.replace(/\.bin$/i, '.zip');
      const zipPath = path.join(binDir, zipFileName);

      try {
        console.log(`  Creating ZIP: ${binFile} → ${zipFileName}...`);

        // Read .bin file
        const binBuffer = await fs.readFile(binPath);

        // Create ZIP file
        const zip = new JSZip();
        zip.file(binFile, binBuffer);

        // Generate ZIP buffer
        const zipBuffer = await zip.generateAsync({
          type: 'nodebuffer',
          compression: 'DEFLATE',
          compressionOptions: { level: 9 }
        });

        // Write ZIP file
        await fs.writeFile(zipPath, zipBuffer);

        const binStats = await fs.stat(binPath);
        const zipStats = await fs.stat(zipPath);
        const compressionRatio = ((1 - zipStats.size / binStats.size) * 100).toFixed(1);
        
        console.log(`    ✅ Created: ${zipFileName}`);
        console.log(`       BIN: ${(binStats.size / 1024).toFixed(2)} KB`);
        console.log(`       ZIP: ${(zipStats.size / 1024).toFixed(2)} KB (${compressionRatio}% compression)\n`);

        successCount++;
      } catch (error: any) {
        console.error(`    ❌ Error creating ZIP for ${binFile}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some ZIP files failed to create.');
    } else {
      console.log('\n✨ All ZIP files created successfully!');
    }
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run ZIP creation
createBinZips().catch(console.error);
