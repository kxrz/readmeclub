/**
 * Generate WebP preview images for fonts
 * 
 * Run: npm run generate-font-previews
 * 
 * Requirements:
 * 1. TTF files in public/fonts/
 * 2. Canvas package installed (npm install canvas)
 * 3. Sharp already installed
 * 
 * Output: WebP images in public/previews/
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const fontsDir = path.join(projectRoot, 'public', 'fonts');
const previewsDir = path.join(projectRoot, 'public', 'previews');

// Sample text for preview
const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog.

A-Z a-z 0-9
Àà Éé Èè Êê Ôô Çç
中文 日本語 한국어

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

async function generatePreviews() {
  console.log('🔄 Starting font preview generation...\n');

  // Ensure output directory exists
  await fs.mkdir(previewsDir, { recursive: true });

  try {
    // Check if canvas is available (for Node.js rendering)
    let Canvas: any;
    try {
      Canvas = (await import('canvas')).default;
    } catch (error) {
      console.log('⚠️  Canvas package not found.');
      console.log('   Install it with: npm install canvas');
      console.log('   Or use browser-based preview generation.\n');
      return;
    }

    // Read all TTF files
    const files = await fs.readdir(fontsDir);
    const ttfFiles = files.filter(f => f.endsWith('.ttf'));

    if (ttfFiles.length === 0) {
      console.log('⚠️  No TTF files found in public/fonts/');
      return;
    }

    console.log(`📁 Found ${ttfFiles.length} TTF file(s)\n`);

    const width = 480;
    const height = 800;
    const fontSize = 12;
    const lineHeight = 1.5;
    const padding = 20;

    for (const ttfFile of ttfFiles) {
      const fontName = ttfFile.replace(/\.ttf$/i, '');
      const previewFile = `${fontName}-sample.webp`;
      const previewPath = path.join(previewsDir, previewFile);

      try {
        console.log(`  Generating: ${previewFile}...`);

        // Create canvas
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Load font
        const fontPath = path.join(fontsDir, ttfFile);
        Canvas.registerFont(fontPath, { family: fontName });

        // Set font
        ctx.font = `${fontSize}px "${fontName}"`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#000000';

        // Render text with word wrapping
        const maxWidth = width - (padding * 2);
        const lineHeightPx = fontSize * lineHeight;
        let y = padding;
        const words = SAMPLE_TEXT.split(' ');

        let line = '';
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);

          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, padding, y);
            line = words[i] + ' ';
            y += lineHeightPx;

            if (y + lineHeightPx > height - padding) break;
          } else {
            line = testLine;
          }
        }

        if (line && y + lineHeightPx <= height - padding) {
          ctx.fillText(line, padding, y);
        }

        // Convert to PNG buffer
        const pngBuffer = canvas.toBuffer('image/png');

        // Convert PNG to WebP with Sharp
        await sharp(pngBuffer)
          .webp({ quality: 85 })
          .toFile(previewPath);

        const stats = await fs.stat(previewPath);
        console.log(`    ✅ Created: ${previewFile} (${(stats.size / 1024).toFixed(2)} KB)\n`);
      } catch (error: any) {
        console.error(`    ❌ Error generating ${previewFile}:`, error.message);
      }
    }

    console.log('✅ Preview generation complete!\n');
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run generation
generatePreviews().catch(console.error);

