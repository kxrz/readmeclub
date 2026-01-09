/**
 * LocalStorage helpers for Font Finder
 * 
 * Stores:
 * - Presets (font + EPUB + settings)
 * - Uploaded EPUBs metadata
 */

export interface Preset {
  id: string;
  name: string;
  fontId: string;
  epubName: string;
  settings: {
    size: number;
    lineHeight: number;
  };
  timestamp: number;
}

export interface EPUBFile {
  name: string;
  text: string; // First 5000 chars for preview
  size: number;
  timestamp: number;
}

const PRESETS_KEY = 'xteink_font_finder_presets';
const EPUBS_KEY = 'xteink_font_finder_epubs';

/**
 * Presets management
 */
export function savePreset(preset: Preset): void {
  if (typeof window === 'undefined') return;
  
  const presets = loadPresets();
  const existingIndex = presets.findIndex(p => p.id === preset.id);
  
  if (existingIndex >= 0) {
    presets[existingIndex] = preset;
  } else {
    presets.push(preset);
  }
  
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function loadPresets(): Preset[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(PRESETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deletePreset(id: string): void {
  if (typeof window === 'undefined') return;
  
  const presets = loadPresets();
  const filtered = presets.filter(p => p.id !== id);
  localStorage.setItem(PRESETS_KEY, JSON.stringify(filtered));
}

/**
 * EPUB storage
 * Note: For large EPUBs, consider using IndexedDB instead
 */
export function saveEPUBToStorage(epub: EPUBFile): void {
  if (typeof window === 'undefined') return;
  
  const epubs = loadEPUBs();
  const existingIndex = epubs.findIndex(e => e.name === epub.name);
  
  if (existingIndex >= 0) {
    epubs[existingIndex] = epub;
  } else {
    epubs.push(epub);
  }
  
  localStorage.setItem(EPUBS_KEY, JSON.stringify(epubs));
}

export function loadEPUBs(): EPUBFile[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(EPUBS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function loadEPUBFromStorage(name: string): EPUBFile | null {
  if (typeof window === 'undefined') return null;
  
  const epubs = loadEPUBs();
  return epubs.find(e => e.name === name) || null;
}

export function deleteEPUB(name: string): void {
  if (typeof window === 'undefined') return;
  
  const epubs = loadEPUBs();
  const filtered = epubs.filter(e => e.name !== name);
  localStorage.setItem(EPUBS_KEY, JSON.stringify(filtered));
}

