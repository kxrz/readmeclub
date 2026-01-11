/**
 * Live Preview Alpine.js data function
 */
export function livePreview() {
  return {
    selectedFont: null,
    epubText: '',
    isRendering: false,
    
    init() {
      // Get fonts data from JSON script tag
      const fontsDataElement = document.getElementById('fonts-data-json');
      const fontsDataJson = fontsDataElement && fontsDataElement.textContent ? fontsDataElement.textContent.trim() : '[]';
      
      const fonts = JSON.parse(fontsDataJson);
      const adelphFont = fonts.find(f => f.id === 'nv-adelph');
      if (adelphFont) {
        this.selectedFont = adelphFont;
        setTimeout(() => {
          this.renderPreview();
          document.dispatchEvent(new CustomEvent('font-selected', { 
            detail: { font: adelphFont },
            bubbles: true 
          }));
        }, 100);
      }
      
      document.addEventListener('font-selected', (event) => {
        this.selectedFont = event.detail.font;
        this.renderPreview();
      });
      
      document.addEventListener('text-changed', (event) => {
        this.epubText = event.detail.text;
        this.renderPreview();
      });
      
      document.addEventListener('epub-loaded', (event) => {
        this.epubText = event.detail.text;
        this.renderPreview();
      });
    },
    
    async renderPreview() {
      if (this.isRendering || !this.selectedFont) return;
      
      this.isRendering = true;
      const canvas = this.$refs.livePreviewCanvas;
      if (!canvas) {
        this.isRendering = false;
        return;
      }
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        this.isRendering = false;
        return;
      }
      
      const displayWidth = 480;
      const displayHeight = 800;
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, displayWidth, displayHeight);
      
      const fontUrl = `/fonts/${this.selectedFont.file}`;
      const fontName = `preview-${this.selectedFont.id}`;
      const fontFace = new FontFace(fontName, `url(${fontUrl})`);
      
      try {
        await fontFace.load();
        document.fonts.add(fontFace);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const baseSizePt = this.selectedFont.x4Preset?.size || 12;
        const ppi = 220;
        const pointsToPixels = ppi / 72;
        const fontSize = Math.round(baseSizePt * pointsToPixels * 0.75);
        
        ctx.font = `${fontSize}px "${fontName}", serif`;
        ctx.fillStyle = '#000000';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.imageSmoothingEnabled = false;
        
        if (!this.epubText) {
          const fontNameText = this.selectedFont.name;
          const centerX = displayWidth / 2;
          const centerY = displayHeight / 2;
          const metrics = ctx.measureText(fontNameText);
          const textX = Math.round(centerX - metrics.width / 2);
          const textY = Math.round(centerY);
          ctx.fillText(fontNameText, textX, textY);
        } else {
          const lineHeight = this.selectedFont.x4Preset?.lineHeight || 1.6;
          const leftPadding = 15;
          const rightPadding = 15;
          const topPadding = 15;
          const bottomPadding = 15;
          const maxWidth = displayWidth - leftPadding - rightPadding;
          const maxHeight = displayHeight - topPadding - bottomPadding;
          const lineHeightPx = Math.round(fontSize * lineHeight);
          
          if (maxWidth <= 0) return;
          
          let y = topPadding;
          const cleanText = this.epubText
            .replace(/[\x00-\x09\x0B-\x1F\x7F]/g, ' ')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim();
          
          const paragraphs = cleanText.split(/\n\n+/);
          
          for (let paraIdx = 0; paraIdx < paragraphs.length; paraIdx++) {
            const paragraph = paragraphs[paraIdx];
            const lines = paragraph.split('\n');
            
            for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
              let line = lines[lineIdx].trim();
              if (!line) {
                y += lineHeightPx;
                if (y + lineHeightPx > maxHeight + topPadding) break;
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
                  const roundedX = Math.round(leftPadding);
                  const roundedY = Math.round(y);
                  ctx.fillText(currentLine.trim(), roundedX, roundedY);
                  y += lineHeightPx;
                  if (y + lineHeightPx > maxHeight + topPadding) break;
                  currentLine = listPrefix ? listPrefix + word : word;
                } else {
                  currentLine = testLine;
                }
              }
              
              if (currentLine.trim()) {
                const roundedX = Math.round(leftPadding);
                const roundedY = Math.round(y);
                ctx.fillText(currentLine.trim(), roundedX, roundedY);
                y += lineHeightPx;
                if (y + lineHeightPx > maxHeight + topPadding) break;
              }
            }
            
            if (paraIdx < paragraphs.length - 1) {
              y += lineHeightPx;
              if (y + lineHeightPx > maxHeight + topPadding) break;
            }
          }
        }
      } catch (e) {
        console.error('Font loading error:', e);
        ctx.fillStyle = '#ff0000';
        ctx.fillText('Font loading failed', 20, 40);
      }
      
      this.isRendering = false;
    }
  };
}

