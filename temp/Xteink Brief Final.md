# XTEink Font Finder - Brief Technique Cursor
## Janvier 2026 - Vibe Coding

---

## 🎯 Produit (TL;DR)

**Font Finder pour e-ink**
- Search 20 curated e-ink fonts (Literata, Garamond, etc)
- Live preview avec X4 dimensions (480×800)
- Upload EPUB perso → render en direct avec font
- Download font (TTF + BIN Lakafior format)
- Gallery de screenshots (font samples → markdown → PNG/WebP)
- LocalStorage pour save presets

---

## 🛠️ Tech Stack (Cursor-friendly)

```
Next.js 15 (App Router)
├─ React 19 (components)
├─ Tailwind (styling)
├─ Zustand (state)
├─ epub.js (read EPUB client-side)
├─ Canvas API (render text)
├─ Sharp (build-time: TTF→PNG→WebP)
└─ Vercel (deploy)

Storage:
├─ public/fonts/ → TTF files (from ebook-fonts + Google)
├─ public/fonts-bin/ → Pre-generated BIN files
├─ public/previews/ → Pre-generated WebP screenshots
└─ LocalStorage → User presets + uploaded EPUBs

APIs:
├─ Google Fonts API (search)
└─ Nothing else (100% client-side)
```

---

## 📁 File Structure

```
xteink-font-finder/
├── public/
│   ├── fonts/
│   │   ├── literata.ttf
│   │   ├── nv-garamond.ttf
│   │   ├── merriweather.ttf
│   │   └── ... (20 curated)
│   ├── fonts-bin/
│   │   ├── literata.bin (pre-converted Lakafior)
│   │   └── ...
│   ├── previews/
│   │   ├── literata-sample.webp (font sample rendered)
│   │   └── ...
│   └── sample.epub (demo EPUB)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (landing)
│   │   └── finder/
│   │       └── page.tsx (main app)
│   │
│   ├── components/
│   │   ├── FontSearch.tsx (tabs: curated, google, upload)
│   │   ├── EPUBUpload.tsx (drag-drop EPUB)
│   │   ├── Preview.tsx (X4 viewport, render text with selected font)
│   │   ├── EPUBReader.tsx (display EPUB with font)
│   │   ├── FontGallery.tsx (show preview screenshots)
│   │   ├── ExportPanel.tsx (download TTF + BIN)
│   │   └── PresetSaver.tsx (localStorage)
│   │
│   ├── lib/
│   │   ├── fonts.ts (font metadata + collections)
│   │   ├── epub-parser.ts (read EPUB locally)
│   │   ├── preview-renderer.ts (canvas rendering)
│   │   ├── bin-converter.ts (Lakafior logic - extract from repo)
│   │   └── storage.ts (localStorage helpers)
│   │
│   ├── hooks/
│   │   ├── useFontSelection.ts
│   │   ├── useEPUBUpload.ts
│   │   └── usePresets.ts
│   │
│   ├── types/
│   │   ├── font.ts (Font interface)
│   │   └── epub.ts (EPUB interface)
│   │
│   └── styles/
│       └── globals.css
│
├── scripts/
│   ├── generate-previews.js (Build-time: render fonts → PNG/WebP)
│   └── convert-fonts-to-bin.js (Build-time: TTF→BIN via Lakafior)
│
├── package.json
├── next.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 🔄 User Flow

```
┌─────────────────────────────────┐
│  XTEink Font Finder             │
├─────────────────────────────────┤
│                                 │
│ [Tab: Curated | Google | Upload]│
│                                 │
│ Left: Font List                 │
│ ├─ Literata [+info]             │
│ ├─ NV Garamond [+info]          │
│ └─ ...                          │
│                                 │
│ Right: Preview (480×800)        │
│ ├─ X4 viewport                  │
│ ├─ Render selected EPUB text    │
│ │  with selected font           │
│ ├─ [Load demo.epub] [Upload]    │
│ └─ Character: A-Z, Accents, ... │
│                                 │
│ Bottom:                         │
│ ├─ [Save Preset]               │
│ ├─ [Download TTF]              │
│ └─ [Download BIN]              │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 Components (Cursor Tasks)

### 1. FontSearch.tsx
```typescript
// Tabs: "Curated (20)", "Google Fonts (1900)", "Upload TTF"
// Tab 1: Show curated fonts (Literata, Garamond, etc)
// Tab 2: Search Google Fonts
// Tab 3: Drag-drop file upload

interface Font {
  id: string
  name: string
  file: string // "literata.ttf"
  bin?: string // "literata.bin"
  preview?: string // "literata-sample.webp"
  source: 'curated' | 'google' | 'upload'
  einkReason?: string
  x4Preset?: { size: number, lineHeight: number }
}

export function FontSearch({ onSelect }: { onSelect: (font: Font) => void })
```

### 2. EPUBUpload.tsx
```typescript
// Drag-drop EPUB or use demo sample.epub
// Parse EPUB locally (epub.js library)
// Extract first chapter text for preview

interface EPUBFile {
  name: string
  text: string // extracted text for preview
  chapters?: string[]
  stored: boolean // in localStorage
}

export function EPUBUpload({ onLoad }: { onLoad: (epub: EPUBFile) => void })
```

### 3. Preview.tsx (Core)
```typescript
// Canvas-based X4 viewport (480×800)
// Load selected font (TTF)
// Render EPUB text with font
// Show e-ink B/W conversion (ordered dithering)
// Live update as user changes font

// Key features:
// - FontFace API to load TTF
// - Canvas context.font = "12px Literata"
// - Render text line by line
// - Apply e-ink dithering filter
// - Show character showcase (A-Z, accents, émojis)

export function Preview({ 
  font: Font, 
  epubText: string 
}: { font: Font, epubText: string })
```

### 4. FontGallery.tsx
```typescript
// Show pre-generated WebP previews for each font
// Read from public/previews/*.webp
// Display as cards with font info

export function FontGallery()
```

### 5. ExportPanel.tsx
```typescript
// Download buttons:
// - TTF: fetch from public/fonts/{id}.ttf
// - BIN: fetch from public/fonts-bin/{id}.bin
// - Info card: font metadata + settings used

export function ExportPanel({ font: Font })
```

### 6. PresetSaver.tsx
```typescript
// Save current setup (font + EPUB + settings) to localStorage
// Load presets (dropdown)
// Delete presets

interface Preset {
  id: string
  name: string
  fontId: string
  epubName: string
  settings: { size: number, lineHeight: number }
  timestamp: number
}

export function PresetSaver()
```

---

## 💾 Data Layer (lib/)

### fonts.ts
```typescript
export const CURATED_FONTS = [
  {
    id: 'literata',
    name: 'Literata',
    file: 'literata.ttf',
    bin: 'literata.bin',
    preview: 'literata-sample.webp',
    source: 'curated',
    einkReason: 'Designed for ereading, tested on e-readers',
    x4Preset: { size: 12, lineHeight: 1.5 }
  },
  {
    id: 'nv-garamond',
    name: 'NV Garamond',
    file: 'nv-garamond.ttf',
    bin: 'nv-garamond.bin',
    preview: 'nv-garamond-sample.webp',
    source: 'curated',
    einkReason: '10% larger x-height, optimized for small screens',
    x4Preset: { size: 11, lineHeight: 1.5 }
  },
  // ... 18 more
]

export function getFontById(id: string): Font | null
export function searchGoogleFonts(query: string): Promise<Font[]>
```

### epub-parser.ts
```typescript
// Use epub.js library to parse EPUB locally
// Extract text from first chapter
// Return as plain string

export async function parseEPUB(file: File): Promise<EPUBFile>
```

### preview-renderer.ts
```typescript
// Canvas rendering logic
// Load font, render text, apply dithering

export function renderPreview(
  canvas: HTMLCanvasElement,
  text: string,
  fontFamily: string,
  fontSize: number
): void

export function applyEinkDithering(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void
```

### bin-converter.ts
```typescript
// ⭐ IMPORTANT: Extract from Lakafior's repo
// See section: "How to Extract Lakafior's bin-converter"

// Import Lakafior's conversion logic
// Wrap it in function: convertTTFToBIN(ttfBuffer): binBuffer

export function convertTTFToBIN(ttfBuffer: ArrayBuffer): ArrayBuffer
```

### storage.ts
```typescript
export function savePreset(preset: Preset): void
export function loadPresets(): Preset[]
export function saveEPUBToStorage(epub: EPUBFile): void
export function loadEPUBFromStorage(name: string): EPUBFile | null
```

---

## 🔨 Build Scripts (Pre-generate Assets)

### scripts/generate-previews.js
```javascript
// Run at build time (next build)
// For each font in public/fonts/:
//   1. Load TTF
//   2. Render sample text (A-Z + "The quick brown fox")
//   3. Apply e-ink dithering
//   4. Save as WebP to public/previews/

// Use Sharp (npm install sharp):
const sharp = require('sharp')
const Canvas = require('canvas')

// For each font file:
// - Create canvas 480×800 (X4)
// - Render text with font
// - Export to PNG then WebP (Sharp)
// - Save to public/previews/font-name.webp
```

### scripts/convert-fonts-to-bin.js
```javascript
// Run at build time
// For each font in public/fonts/:
//   1. Load TTF
//   2. Call Lakafior's converter (from lib/bin-converter.ts)
//   3. Save .bin to public/fonts-bin/

// Import Lakafior's bin-converter
const { convertTTFToBIN } = require('../src/lib/bin-converter')
const fs = require('fs')
const path = require('path')

const fontsDir = path.join(__dirname, '../public/fonts')
const binOutDir = path.join(__dirname, '../public/fonts-bin')

// For each TTF:
//   - const ttfBuffer = fs.readFileSync('font.ttf')
//   - const binBuffer = convertTTFToBIN(ttfBuffer)
//   - fs.writeFileSync('font.bin', binBuffer)
```

### package.json scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run generate-previews && npm run convert-fonts && next build",
    "generate-previews": "node scripts/generate-previews.js",
    "convert-fonts": "node scripts/convert-fonts-to-bin.js",
    "start": "next start"
  }
}
```

---

## 🌐 Routes

```
/ → Landing
  ├─ What is Font Finder
  ├─ Demo (link to /finder)
  └─ Features

/finder → Main App
  ├─ Left: Font search panel
  ├─ Right: X4 preview
  └─ Bottom: Export + presets
```

---

## 💾 LocalStorage Schema

```javascript
// Presets
localStorage.setItem('xteink_presets', JSON.stringify([
  {
    id: 'preset-1',
    name: 'My Novel Setup',
    fontId: 'literata',
    epubName: 'demo.epub',
    settings: { size: 12, lineHeight: 1.5 },
    timestamp: 1704729600000
  }
]))

// Uploaded EPUBs (keep only metadata, store file in IndexedDB if large)
localStorage.setItem('xteink_epubs', JSON.stringify([
  {
    name: 'my-book.epub',
    text: '[first 5000 chars for preview]',
    size: 1024000,
    timestamp: 1704729600000
  }
]))
```

---

## 📦 Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^15.0",
    "react": "^19.0",
    "tailwindcss": "^3.4",
    "zustand": "^4.4",
    "epub": "^1.2",
    "canvas": "^2.11"
  },
  "devDependencies": {
    "sharp": "^0.33",
    "typescript": "^5.3"
  }
}
```

---

## 🔧 How to Extract Lakafior's bin-converter (IMPORTANT!)

### Step 1: Clone Lakafior's Repo
```bash
git clone https://github.com/Lakafior/xteink.git
cd xteink
```

### Step 2: Find the Converter Logic
Look for files in these directories:
- `src/` → Look for `font-converter.ts`, `bin-converter.ts`, `ttf-to-bin.js`
- `lib/` → Same files
- `tools/` → Converter utilities
- `scripts/` → Build scripts that convert fonts

**Common file patterns:**
```
xteink/
├── src/
│   ├── utils/font-converter.ts
│   ├── lib/bin-converter.ts
│   └── tools/ttf-to-bin.js
├── lib/
│   └── font-tools.ts
└── scripts/
    └── convert-fonts.js
```

### Step 3: Extract the Converter Function
Once you find the converter, extract the core function. It typically looks like:

```typescript
// From Lakafior's repo
export function ttfToBin(ttfBuffer: ArrayBuffer, options?: ConvertOptions): ArrayBuffer {
  // Conversion logic here
  // - Read TTF file structure
  // - Process glyph data
  // - Optimize for e-ink
  // - Output BIN format
}
```

### Step 4: Copy to Your Project
Create `src/lib/bin-converter.ts`:
```typescript
// Extracted from github.com/Lakafior/xteink
// Original author: Lakafior
// License: Check Lakafior's repo

// [PASTE LAKAFIOR'S CONVERTER CODE HERE]

export function convertTTFToBIN(ttfBuffer: ArrayBuffer): ArrayBuffer {
  // Call Lakafior's converter or use directly
  return ttfToBin(ttfBuffer)
}
```

### Step 5: Use in Build Script
In `scripts/convert-fonts-to-bin.js`:
```javascript
const { convertTTFToBIN } = require('../src/lib/bin-converter')
const fs = require('fs')

// Use it:
const ttfBuffer = fs.readFileSync('public/fonts/literata.ttf')
const binBuffer = convertTTFToBIN(ttfBuffer)
fs.writeFileSync('public/fonts-bin/literata.bin', binBuffer)
```

### Common Issues & Solutions
| Issue | Solution |
|-------|----------|
| Converter expects different input format | Check Lakafior's README for API docs |
| TypeScript errors | Check types in Lakafior's repo |
| Output BIN format differs | Compare with known working BIN files |
| Performance slow | Lakafior may have optimized versions |

---

## 🚀 Cursor Workflow

**Paste this into Cursor:**

```
I'm building XTEink Font Finder - a font discovery tool for e-ink devices.

Stack: Next.js 15 + React 19 + Tailwind

Features:
1. Search 20 curated e-ink fonts (Literata, Garamond, etc)
2. Upload EPUB → preview text rendered with selected font in X4 viewport (480×800)
3. Preview shows B/W e-ink rendering
4. Download font as TTF or pre-converted BIN
5. LocalStorage for saving presets and EPUBs

Structure:
- public/fonts/ → TTF files
- public/fonts-bin/ → Pre-converted BIN files (via Lakafior's tool)
- public/previews/ → Pre-generated WebP screenshots
- src/components/ → 6 React components (FontSearch, EPUBUpload, Preview, FontGallery, ExportPanel, PresetSaver)
- src/lib/ → Parsing, rendering, storage logic
- scripts/ → Build-time font-to-preview and font-to-bin generation

IMPORTANT: I need to extract Lakafior's TTF→BIN converter from https://github.com/Lakafior/xteink
- Clone the repo
- Find the converter function (usually in src/lib/ or src/utils/)
- Copy it to src/lib/bin-converter.ts
- Use it in scripts/convert-fonts-to-bin.js for build-time conversion

Start with:
1. Extract Lakafior's converter (see brief for detailed steps)
2. Create components/Preview.tsx → X4 canvas rendering with canvas API
3. Create lib/preview-renderer.ts → Font rendering logic
4. Create components/FontSearch.tsx → List curated fonts
5. Build out from there

Key tech:
- Canvas API for preview (no headless browser needed)
- epub.js for reading EPUB client-side
- FontFace API to load TTF dynamically
- Sharp (build-time) for WebP generation
- Lakafior's TTF→BIN converter (extracted and integrated)

Ready to start?
```

---

## 📋 Checklist Cursor

```
[ ] Clone & analyze Lakafior's repo (github.com/Lakafior/xteink)
[ ] Extract bin-converter logic to src/lib/bin-converter.ts
[ ] Setup Next.js project with Tailwind
[ ] Create public/fonts/ (add 20 TTF files)
[ ] Create components/Preview.tsx (X4 canvas rendering)
[ ] Create lib/preview-renderer.ts (canvas logic)
[ ] Create components/FontSearch.tsx (font tabs)
[ ] Create lib/fonts.ts (font metadata)
[ ] Create components/EPUBUpload.tsx (drag-drop)
[ ] Create lib/epub-parser.ts (extract text)
[ ] Create components/ExportPanel.tsx (download buttons)
[ ] Create components/PresetSaver.tsx (localStorage)
[ ] Create scripts/generate-previews.js (WebP generation)
[ ] Create scripts/convert-fonts-to-bin.js (TTF→BIN using extracted converter)
[ ] Add to package.json: "build": "npm run generate-previews && npm run convert-fonts && next build"
[ ] Test Preview component with demo EPUB
[ ] Deploy to Vercel
[ ] Announce on Reddit
```

---

## 🎯 Phase 2 (Later)

- [ ] Multi-device preview (Clara, Kobo, not just X4)
- [ ] Community gallery (share best setups)
- [ ] Character coverage check (does font have accents?)
- [ ] Fontshare + Google Fonts full integration
- [ ] Dark mode

---

## 🙏 Credits & Attribution

### Lakafior's XTEink Font Tools
- **TTF→BIN Converter**: Used for pre-generating optimized font binaries
- **GitHub**: https://github.com/Lakafior/xteink
- **License**: Check Lakafior's repo license
- **Usage**: Converter extracted from repo and integrated in build pipeline
- **Attribution**: Add to README + Footer:
  ```markdown
  Font conversion via [Lakafior's XTEink tools](https://github.com/Lakafior/xteink)
  ```

### Open Font Collections
- **ebook-fonts**: [nicoverbruggen/ebook-fonts](https://github.com/nicoverbruggen/ebook-fonts)
  - Attribution: "Modified fonts optimized for e-readers by nicoverbruggen"
- **Google Fonts**: [fonts.google.com](https://fonts.google.com)
  - License: OFL (Open Font License)
- **Fontshare**: [fontshare.com](https://fontshare.com)
  - By Indian Type Foundry

### Libraries Used
- **epub.js**: For parsing EPUB files client-side
- **Sharp**: For WebP image generation (build-time)
- **Canvas**: For font rendering and preview generation

### README Attribution Section
```markdown
## 🙏 Thanks

This project wouldn't be possible without:

- **[Lakafior](https://github.com/Lakafior)** for XTEink conversion tools
- **[nicoverbruggen](https://github.com/nicoverbruggen)** for e-ink optimized fonts
- **[Google Fonts](https://fonts.google.com)** for open-source typefaces
- **[Indian Type Foundry](https://fontshare.com)** for professional fonts
```

---

## 🏁 MVP Done When

- Font Finder loads → shows 20 curated fonts
- Upload EPUB → renders text in X4 viewport with font
- Change font → preview updates in real-time
- Download TTF + BIN working
- LocalStorage presets working
- Deploy to Vercel

**Time**: 2 weeks vibe coding (flexible)

---

**Ready to @Cursor this?** 🚀
