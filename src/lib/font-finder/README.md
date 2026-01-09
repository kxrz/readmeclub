# Font Finder - Setup Instructions

## 1. Extract Lakafior's TTF→BIN Converter

### Steps:

```bash
# Clone Lakafior's repo (outside this project)
cd /tmp
git clone https://github.com/Lakafior/xteink.git
cd xteink
```

### Find the converter:

Look in these directories:
- `src/` → `font-converter.ts`, `bin-converter.ts`, `ttf-to-bin.js`
- `lib/` → Same files
- `tools/` → Converter utilities
- `scripts/` → Build scripts

### Extract the function:

Once found, copy the `ttfToBin` or similar function to:
`src/lib/font-finder/bin-converter.ts`

Replace the placeholder `convertTTFToBIN` function with the actual implementation.

## 2. Get ebook-fonts (nicoverbruggen)

### Option A: Clone as submodule
```bash
cd /Users/florentbertiaux/Documents/GitHub/xteinkhub2026
git submodule add https://github.com/nicoverbruggen/ebook-fonts.git temp/ebook-fonts
```

### Option B: Copy TTF files directly
```bash
# Clone temporarily
cd /tmp
git clone https://github.com/nicoverbruggen/ebook-fonts.git
cd ebook-fonts

# Copy relevant TTF files to public/fonts/
# Recommended fonts:
# - NV Garamond
# - NV Literata  
# - NV Merriweather
# - NV Crimson
# - NV Charter
```

Copy the `.ttf` files to `public/fonts/` with the names matching `fonts.ts`:
- `nv-garamond.ttf`
- `nv-literata.ttf`
- `nv-merriweather.ttf`
- `nv-crimson.ttf`
- `nv-charter.ttf`

## 3. Download Google Fonts

For the curated Google Fonts, download from:
https://fonts.google.com/

Recommended fonts (already in `fonts.ts`):
- Literata
- EB Garamond
- Merriweather
- Bitter
- Lato
- Crimson Text
- Lora
- Source Serif Pro
- Noto Serif
- PT Serif
- Libre Baskerville
- Vollkorn
- Spectral
- Cormorant
- Playfair Display
- Roboto Slab
- Raleway

Download the `.ttf` files and place them in `public/fonts/` with names matching `fonts.ts`.

## 4. Generate BIN files

Once the Lakafior converter is integrated, run:

```bash
npm run convert-fonts-to-bin
```

This will convert all TTF files in `public/fonts/` to BIN format in `public/fonts-bin/`.

## 5. Generate Preview Images

```bash
npm run generate-font-previews
```

This will create WebP preview images in `public/previews/`.

## Notes

- The converter extraction is the most critical step
- Font files should match the names in `src/lib/font-finder/fonts.ts`
- BIN files are only generated for fonts that have the converter working
- Preview images help users see fonts before selecting

