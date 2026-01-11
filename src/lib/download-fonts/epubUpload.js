/**
 * EPUB Upload Alpine.js data function
 */
export function epubUpload() {
  return {
    epubName: null,
    isLoading: false,
    error: null,
    isDragging: false,
    fullText: '',
    pages: [],
    currentPage: 0,
    totalPages: 0,
    
    async init() {
      setTimeout(() => {
        this.loadDemoEPUB();
      }, 500);
    },
    
    async loadDemoEPUB() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await fetch('/readme-club.epub');
        if (!response.ok) {
          throw new Error(`Failed to load demo EPUB: ${response.status}`);
        }
        const blob = await response.blob();
        await this.parseEPUB(blob, 'readme.club (Demo)');
      } catch (e) {
        console.error('Error loading demo EPUB:', e);
        this.error = 'Failed to load demo EPUB: ' + (e.message || e);
      } finally {
        this.isLoading = false;
      }
    },
    
    async parseEPUB(fileOrBlob, name) {
      try {
        let attempts = 0;
        const maxAttempts = 20;
        while ((!window.ePub || !window.JSZip) && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ePub || !window.JSZip) {
          throw new Error('EPUB libraries not loaded. Please refresh the page.');
        }
        
        const book = window.ePub(fileOrBlob);
        await book.ready;
        
        let epubTitle = name;
        try {
          const metadata = book.packaging?.metadata;
          if (metadata && metadata.title) {
            epubTitle = metadata.title;
          } else if (book.metadata && book.metadata.title) {
            epubTitle = book.metadata.title;
          }
        } catch (e) {
          console.warn('Could not extract EPUB title:', e);
        }
        
        this.epubName = epubTitle;
        this.fullText = '';
        
        const spine = book.spine;
        const items = spine.items;
        const seenHrefs = new Set();
        const allTexts = [];
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          try {
            const href = item.href;
            if (seenHrefs.has(href)) continue;
            seenHrefs.add(href);
            
            const section = await book.load(href);
            const text = section.querySelector('body')?.innerText || '';
            if (text.trim()) {
              allTexts.push(text);
            }
          } catch (e) {
            console.warn('Error loading section', i, ':', e);
          }
        }
        
        this.fullText = allTexts.join('\n\n');
        this.calculatePages();
        this.currentPage = 0;
        this.loadPage(0);
        
        document.dispatchEvent(new CustomEvent('epub-loaded', { 
          detail: { text: this.fullText },
          bubbles: true 
        }));
      } catch (e) {
        console.error('EPUB parsing error:', e);
        this.error = 'Failed to parse EPUB: ' + (e.message || e);
      }
    },
    
    calculatePages() {
      if (!this.fullText) {
        this.pages = [];
        this.totalPages = 0;
        return;
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        const charsPerPage = 2500;
        for (let i = 0; i < this.fullText.length; i += charsPerPage) {
          this.pages.push(this.fullText.substring(i, i + charsPerPage));
        }
        this.totalPages = this.pages.length || 1;
        return;
      }
      
      ctx.font = '16px serif';
      const displayWidth = 480;
      const displayHeight = 800;
      const leftPadding = 12;
      const rightPadding = 12;
      const topPadding = 12;
      const bottomPadding = 12;
      const maxWidth = displayWidth - leftPadding - rightPadding;
      const maxHeight = displayHeight - topPadding - bottomPadding;
      const lineHeightPx = 16 * 1.6;
      
      if (maxWidth <= 0) {
        this.pages.push(this.fullText);
        this.totalPages = 1;
        return;
      }
      
      const cleanText = this.fullText
        .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, ' ')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
      
      const paragraphs = cleanText.split(/\n\n+/);
      let currentPageText = '';
      let currentHeight = topPadding;
      
      for (let paraIdx = 0; paraIdx < paragraphs.length; paraIdx++) {
        const paragraph = paragraphs[paraIdx];
        const lines = paragraph.split('\n');
        
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
          let line = lines[lineIdx].trim();
          
          if (!line) {
            if (currentHeight + lineHeightPx > maxHeight + topPadding) {
              this.pages.push(currentPageText.trim());
              currentPageText = '';
              currentHeight = topPadding;
            }
            currentPageText += '\n';
            currentHeight += lineHeightPx;
            continue;
          }
          
          const listPattern = /^[\s]*[•\-\*\+]\s+(.+)$/;
          const listMatch = line.match(listPattern);
          let listPrefix = '';
          let listText = line;
          
          if (listMatch) {
            listPrefix = '• ';
            listText = listMatch[1];
          }
          
          const words = listText.split(/\s+/).filter(w => w.length > 0);
          let currentLine = listPrefix;
          
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine.trim()) {
              if (currentHeight + lineHeightPx > maxHeight + topPadding) {
                this.pages.push(currentPageText.trim());
                currentPageText = '';
                currentHeight = topPadding;
              }
              currentPageText += currentLine.trim() + '\n';
              currentHeight += lineHeightPx;
              currentLine = listPrefix ? listPrefix + word : word;
            } else {
              currentLine = testLine;
            }
          }
          
          if (currentLine.trim()) {
            if (currentHeight + lineHeightPx > maxHeight + topPadding) {
              this.pages.push(currentPageText.trim());
              currentPageText = '';
              currentHeight = topPadding;
            }
            currentPageText += currentLine.trim() + '\n';
            currentHeight += lineHeightPx;
          }
        }
        
        if (paraIdx < paragraphs.length - 1) {
          if (currentHeight + lineHeightPx > maxHeight + topPadding) {
            this.pages.push(currentPageText.trim());
            currentPageText = '';
            currentHeight = topPadding;
          }
          currentPageText += '\n';
          currentHeight += lineHeightPx;
        }
      }
      
      if (currentPageText.trim()) {
        this.pages.push(currentPageText.trim());
      }
      
      this.totalPages = this.pages.length || 1;
      if (this.currentPage >= this.totalPages) {
        this.currentPage = this.totalPages - 1;
      }
    },
    
    loadPage(pageIndex) {
      if (pageIndex < 0 || pageIndex >= this.totalPages) return;
      this.currentPage = pageIndex;
      const pageText = this.pages[pageIndex] || '';
      
      document.dispatchEvent(new CustomEvent('text-changed', { 
        detail: { text: pageText },
        bubbles: true 
      }));
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.loadPage(this.currentPage + 1);
      }
    },
    
    prevPage() {
      if (this.currentPage > 0) {
        this.loadPage(this.currentPage - 1);
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/epub+zip') {
        this.parseEPUB(file, file.name);
      }
    },
    
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/epub+zip') {
        this.parseEPUB(file, file.name);
      }
    }
  };
}

