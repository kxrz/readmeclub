/**
 * Register Alpine.js functions
 */
import { epubUpload } from './epubUpload.js';
import { livePreview } from './livePreview.js';

export function registerFunctions() {
  if (window.Alpine && window.Alpine.data) {
    window.Alpine.data('epubUpload', epubUpload);
    window.Alpine.data('livePreview', livePreview);
    console.log('✅ Alpine.js functions registered');
  }
}

export function initRegistration() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerFunctions);
  } else {
    registerFunctions();
  }
  
  document.addEventListener('alpine:init', registerFunctions);
  setTimeout(registerFunctions, 100);
}

