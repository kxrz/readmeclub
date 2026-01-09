/**
 * TTF to BIN Converter (Node.js version)
 * 
 * Adapted from Lakafior's XTEink Web Font Maker
 * Original: https://github.com/Lakafior/xteink (XTEink-Web-Font-Maker)
 * 
 * This is a Node.js adaptation using opentype.js + canvas instead of FreeType WASM
 * 
 * License: Check Lakafior's repo license
 */

import * as opentype from 'opentype.js';
import { createCanvas } from 'canvas';

interface ConvertOptions {
  fontSize?: number;
  charSpacing?: number;
  lineSpacing?: number;
  threshold?: number;
  shouldRenderBorder?: boolean;
  useOpticalAlign?: boolean;
  isVerticalFont?: boolean;
}

/**
 * Converts a TTF font buffer to XTEink BIN format
 * 
 * @param ttfBuffer - TTF font file as ArrayBuffer or Node.js Buffer
 * @param options - Conversion options
 * @returns BIN format as ArrayBuffer
 */
export function convertTTFToBIN(
  ttfBuffer: ArrayBuffer | Buffer,
  options: ConvertOptions = {}
): ArrayBuffer {
  const {
    fontSize = 28,
    charSpacing = 0,
    lineSpacing = 0,
    threshold = 127,
    shouldRenderBorder = false,
    useOpticalAlign = false,
    isVerticalFont = false,
  } = options;

  try {
    // opentype.js uses DataView internally, which requires a proper ArrayBuffer
    // The key issue: we need a completely NEW ArrayBuffer, not a view or slice
    // Create a new ArrayBuffer and copy all bytes
    
    let arrayBuffer: ArrayBuffer;
    if (Buffer.isBuffer(ttfBuffer)) {
      // Create a completely new ArrayBuffer and copy all bytes from Buffer
      arrayBuffer = new ArrayBuffer(ttfBuffer.length);
      const target = new Uint8Array(arrayBuffer);
      for (let i = 0; i < ttfBuffer.length; i++) {
        target[i] = ttfBuffer[i];
      }
    } else if (ttfBuffer instanceof ArrayBuffer) {
      // Create a completely new ArrayBuffer (copy, not view)
      const source = new Uint8Array(ttfBuffer);
      arrayBuffer = new ArrayBuffer(source.length);
      const target = new Uint8Array(arrayBuffer);
      target.set(source);
    } else {
      throw new Error('ttfBuffer must be an ArrayBuffer or Node.js Buffer');
    }
    
    // Verify it's a proper ArrayBuffer
    if (!(arrayBuffer instanceof ArrayBuffer) || arrayBuffer.byteLength === 0) {
      throw new Error('Failed to create valid ArrayBuffer from font data');
    }
    
    // Parse with opentype.js
    // opentype.parse should work with ArrayBuffer
    // If it still fails, the issue might be with opentype.js version
    const font = opentype.parse(arrayBuffer);

    // Measure optimal dimensions (simplified version)
    // In Lakafior's version, this scans multiple characters to find max width/height
    const dimensions = measureOptimalFontDimensions(font, fontSize);
    const width = dimensions.width + charSpacing;
    const height = dimensions.height + lineSpacing;

    if (width <= 0 || height <= 0) {
      throw new Error('Resulting width and height must be positive');
    }

    // Calculate buffer size
    const totalChar = 0x10000; // All Unicode characters
    const widthByte = Math.ceil(width / 8);
    const charByte = widthByte * height;
    const binBuffer = new Uint8Array(charByte * totalChar);
    binBuffer.fill(0);

    // Convert each character
    for (let charCode = 0; charCode < totalChar; charCode++) {
      const char = String.fromCharCode(charCode);

      // Skip whitespace characters (they should render as blank)
      if (isWhitespaceOrInvisible(charCode)) {
        continue;
      }

      // Create canvas for this character
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Optional border
      if (shouldRenderBorder) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
      }

      // Get glyph
      const glyph = font.charToGlyph(char);
      if (!glyph || glyph.index === 0) {
        // Missing glyph, skip
        continue;
      }

      // Calculate positioning
      const scale = fontSize / font.unitsPerEm;
      const glyphWidth = glyph.advanceWidth * scale;
      let dx = Math.floor((width - glyphWidth) / 2);
      if (useOpticalAlign) {
        dx = getOpticalDx(char, glyphWidth, width, true);
      }

      const baseline = computeBaselineOffset(height, lineSpacing);
      const glyphHeight = (glyph.yMax - glyph.yMin) * scale;
      const dy = baseline - (glyph.yMax * scale);

      // Render glyph path using opentype.js Path.draw()
      ctx.fillStyle = '#000000';
      const path = glyph.getPath(dx, dy, fontSize);
      path.draw(ctx);

      // Convert canvas to binary format
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = (y * width + x) * 4;
          const bit = data[pixelIndex] < threshold ? 1 : 0; // R channel (grayscale)

          if (bit) {
            let finalByteIdx: number;
            let finalBitIdx: number;

            if (isVerticalFont) {
              finalByteIdx = charCode * charByte + x * widthByte + (y >> 3);
              finalBitIdx = 7 - (y % 8);
            } else {
              finalByteIdx = charCode * charByte + y * widthByte + (x >> 3);
              finalBitIdx = 7 - (x % 8);
            }

            if (finalByteIdx < binBuffer.length) {
              binBuffer[finalByteIdx] |= 1 << finalBitIdx;
            }
          }
        }
      }
    }

    return binBuffer.buffer;
  } catch (error: any) {
    throw new Error(`TTF to BIN conversion failed: ${error.message}`);
  }
}

/**
 * Measure optimal font dimensions by scanning sample characters
 */
function measureOptimalFontDimensions(font: opentype.Font, fontSize: number): { width: number; height: number } {
  const testChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÀàÉéÈèÊêÔôÇç';
  let maxWidth = 0;
  let maxHeight = 0;

  for (const char of testChars) {
    const glyph = font.charToGlyph(char);
    if (glyph && glyph.index !== 0) {
      const scale = fontSize / font.unitsPerEm;
      const width = glyph.advanceWidth * scale;
      const height = (glyph.yMax - glyph.yMin) * scale;
      maxWidth = Math.max(maxWidth, width);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  // Fallback to fontSize if measurement fails
  return {
    width: Math.max(5, maxWidth || fontSize),
    height: Math.max(5, maxHeight || fontSize),
  };
}

/**
 * Check if character is whitespace or invisible
 */
function isWhitespaceOrInvisible(charCode: number): boolean {
  const whitespaceChars = new Set([
    0x0020, 0x00a0, 0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
    0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x202f, 0x205f, 0x3000,
    0x0009, 0x000a, 0x000b, 0x000c, 0x000d, 0x0085, 0x00ad,
    0x200b, 0x200c, 0x200d, 0x2060, 0xfeff,
  ]);
  return whitespaceChars.has(charCode);
}

/**
 * Compute baseline offset
 */
function computeBaselineOffset(boxHeight: number, lineSpacing: number): number {
  if (boxHeight <= 0) return 0;
  const contentHeight = Math.max(0, boxHeight - lineSpacing);
  const baseBaseline = Math.round(contentHeight * 0.75);
  const spacingOffset = Math.floor(lineSpacing / 2);
  let baseline = baseBaseline + spacingOffset;
  if (baseline < 0) return 0;
  if (baseline > boxHeight) return boxHeight;
  return baseline;
}

/**
 * Get optical alignment offset (simplified version)
 */
function getOpticalDx(char: string, glyphWidth: number, boxWidth: number, isFirst: boolean): number {
  // Simplified optical offsets (from Lakafior's code)
  const opticalOffsets: Record<string, number> = {
    'O': -0.1, 'Q': -0.1, 'C': -0.09, 'G': -0.09,
    'o': -0.1, 'q': -0.1, 'c': -0.09, 'g': -0.09,
    '0': -0.1, '6': -0.08, '8': -0.08, '9': -0.08,
    'T': 0.07, 'Y': 0.06, 'V': 0.06, 'W': 0.05, 'A': 0.04,
    'y': 0.05, 'v': 0.05, 'w': 0.04,
    '(': -0.12, '[': -0.12, '{': -0.12,
    ')': 0.12, ']': 0.12, '}': 0.12,
  };

  const offset = opticalOffsets[char] || 0;
  return Math.floor((boxWidth - glyphWidth) / 2) + Math.round(offset * boxWidth);
}
