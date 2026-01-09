/**
 * Type definitions for Font Finder
 */

export interface Font {
  id: string;
  name: string;
  file: string;
  bin?: string;
  preview?: string;
  source: 'ebook-fonts' | 'google-fonts' | 'upload';
  einkReason?: string;
  x4Preset?: {
    size: number;
    lineHeight: number;
  };
  googleFontsId?: string;
  author?: string;
  license?: string;
}

export interface EPUBFile {
  name: string;
  text: string;
  chapters?: string[];
  stored: boolean;
}

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

