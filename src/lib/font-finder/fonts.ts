/**
 * Font Finder - Curated Fonts Collection
 * 
 * Sources:
 * - ebook-fonts: https://github.com/nicoverbruggen/ebook-fonts (e-ink optimized)
 * - Google Fonts: Community consensus picks for e-ink readability
 */

export interface Font {
  id: string;
  name: string;
  file: string; // TTF filename in public/fonts/
  bin?: string; // BIN filename in public/fonts-bin/ (generated)
  preview?: string; // WebP preview in public/previews/ (generated)
  source: 'ebook-fonts' | 'google-fonts' | 'upload';
  einkReason?: string; // Why this font is good for e-ink
  x4Preset?: {
    size: number;
    lineHeight: number;
  };
  googleFontsId?: string; // For Google Fonts API
  author?: string;
  license?: string;
}

/**
 * 20 Curated Fonts for e-ink devices
 * 
 * Mix of:
 * - ebook-fonts (nicoverbruggen) - pre-optimized for e-readers
 * - Google Fonts - community-tested for e-ink readability
 */
export const CURATED_FONTS: Font[] = [
  // === ebook-fonts (nicoverbruggen) ===
  {
    id: 'nv-garamond',
    name: 'Garamond',
    file: 'nv-garamond.ttf',
    bin: 'nv-garamond.bin',
    preview: 'nv-garamond-sample.webp',
    source: 'ebook-fonts',
    einkReason: '10% larger x-height, optimized for small screens, tested on Kobo/Kindle',
    x4Preset: { size: 14, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-literata',
    name: 'Literata',
    file: 'nv-literata.ttf',
    bin: 'nv-literata.bin',
    preview: 'nv-literata-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Designed for e-reading, optimized for e-ink displays',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-merriweather',
    name: 'Merriweather',
    file: 'nv-merriweather.ttf',
    bin: 'nv-merriweather.bin',
    preview: 'nv-merriweather-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Excellent readability on e-ink, optimized line spacing',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-crimson',
    name: 'Crimson',
    file: 'nv-crimson.ttf',
    bin: 'nv-crimson.bin',
    preview: 'nv-crimson-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Classic serif optimized for e-readers',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-charter',
    name: 'Charter',
    file: 'nv-charter.ttf',
    bin: 'nv-charter.bin',
    preview: 'nv-charter-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'High contrast, sharp on e-ink displays',
    x4Preset: { size: 14, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-bitter',
    name: 'Bitter',
    file: 'nv-bitter.ttf',
    bin: 'nv-bitter.bin',
    preview: 'nv-bitter-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Created specifically for e-ink displays, excellent readability',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-georsio',
    name: 'Georsio',
    file: 'nv-georsio.ttf',
    bin: 'nv-georsio.bin',
    preview: 'nv-georsio-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Optimized for e-readers, clear and readable',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-jost',
    name: 'Jost',
    file: 'nv-jost.ttf',
    bin: 'nv-jost.bin',
    preview: 'nv-jost-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Modern sans-serif optimized for e-ink',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-legible-next',
    name: 'Legible Next',
    file: 'nv-legible-next.ttf',
    bin: 'nv-legible-next.bin',
    preview: 'nv-legible-next-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Designed for maximum legibility on e-ink displays',
    x4Preset: { size: 15, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-membo',
    name: 'Membo',
    file: 'nv-membo.ttf',
    bin: 'nv-membo.bin',
    preview: 'nv-membo-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Classic serif optimized for e-readers',
    x4Preset: { size: 14, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  },
  {
    id: 'nv-palatium',
    name: 'Palatium',
    file: 'nv-palatium.ttf',
    bin: 'nv-palatium.bin',
    preview: 'nv-palatium-sample.webp',
    source: 'ebook-fonts',
    einkReason: 'Elegant serif optimized for e-ink displays',
    x4Preset: { size: 14, lineHeight: 1.6 },
    author: 'nicoverbruggen',
    license: 'OFL'
  }
];

/**
 * Get font by ID
 */
export function getFontById(id: string): Font | null {
  return CURATED_FONTS.find(f => f.id === id) || null;
}

/**
 * Search Google Fonts (client-side API call)
 * Note: This will be implemented in the component with fetch to Google Fonts API
 */
export async function searchGoogleFonts(query: string): Promise<Font[]> {
  // This will be implemented client-side in the component
  // Using Google Fonts API: https://fonts.googleapis.com/css2?family=...
  return [];
}

