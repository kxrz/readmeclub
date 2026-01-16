/**
 * Générateur de contenu Weekly Digest pour articles de news
 */

const PROD_URL = 'https://readme.club';
const MAX_WALLPAPERS = 15;

export interface WeeklyDigestData {
  period: {
    start: Date;
    end: Date;
    startFormatted: string;
    endFormatted: string;
    weekNumber: number;
  };
  stats: {
    resources: number;
    news: number;
    wallpapers: number;
  };
  resources: any[];
  news: any[];
  wallpapers: any[];
}

/**
 * Génère l'excerpt TL;DR pour l'article
 */
export function generateWeeklyDigestExcerpt(
  period: { startFormatted: string; endFormatted: string },
  stats: { resources: number; news: number; wallpapers: number }
): string {
  const parts: string[] = [];
  if (stats.resources > 0) parts.push(`${stats.resources} resource${stats.resources > 1 ? 's' : ''}`);
  if (stats.news > 0) parts.push(`${stats.news} news article${stats.news > 1 ? 's' : ''}`);
  if (stats.wallpapers > 0) parts.push(`${stats.wallpapers} wallpaper${stats.wallpapers > 1 ? 's' : ''}`);
  
  const statsText = parts.length > 0 ? parts.join(', ') : 'no new content';
  return `TL;DR: ${period.startFormatted} → ${period.endFormatted}, we had ${statsText}.`;
}

/**
 * Génère le contenu Markdown pour un article Weekly Digest
 */
export function generateWeeklyDigestMarkdown(
  data: WeeklyDigestData,
  intro: string,
  randomRes?: any,
  resolvedImageUrls: Record<string, string> = {}
): string {
  const { period, stats, resources, news, wallpapers } = data;
  
  let md = '';
  
  // Intro (sans titre ni dates)
  if (intro) {
    md += `${intro}\n\n`;
  }
  
  // Summary
  const totalItems = stats.resources + stats.news + stats.wallpapers;
  if (totalItems === 0) {
    md += `No new content this week. Stay tuned!\n`;
    return md;
  }
  
  md += `## 🎯 This Week's Highlights\n\n`;
  md += `We added **${totalItems}** new items to the community hub:\n\n`;
  if (stats.resources > 0) md += `- 📦 **${stats.resources}** new resources\n`;
  if (stats.news > 0) md += `- 📰 **${stats.news}** news articles\n`;
  if (stats.wallpapers > 0) md += `- 🖼️ **${stats.wallpapers}** wallpapers\n`;
  md += `\n`;
  
  // Resources
  if (resources && resources.length > 0) {
    md += `## 📦 New Resources\n\n`;
    resources.forEach((r: any) => {
      const link = `${PROD_URL}/resources/${r.id}`;
      let cleanDesc = (r.description || '')
        .replace(/https?:\/\/[^\s)]+/g, '')
        .replace(/\(\s*\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanDesc.length > 120) cleanDesc = cleanDesc.substring(0, 120) + '...';
      
      md += `### [${r.title}](${link})\n`;
      if (cleanDesc) md += `> ${cleanDesc}\n\n`;
      md += `🏷️ *${r.type}*\n\n`;
    });
  }
  
  // News
  if (news && news.length > 0) {
    md += `## 📰 Latest News\n\n`;
    news.forEach((n: any) => {
      const link = `${PROD_URL}/news/${n.slug}`;
      md += `### [${n.title}](${link})\n`;
      if (n.excerpt) {
        md += `> ${n.excerpt}\n\n`;
      }
    });
  }
  
  // Wallpapers
  if (wallpapers && wallpapers.length > 0) {
    const displayedWallpapers = wallpapers.slice(0, MAX_WALLPAPERS);
    const remainingCount = wallpapers.length - MAX_WALLPAPERS;
    const top3 = wallpapers.slice(0, 3);
    
    md += `## 🖼️ Popular New Wallpapers\n\n`;
    md += `*Sorted by downloads*\n\n`;
    
    // Top 3 avec images
    top3.forEach((w: any, index: number) => {
      const link = `${PROD_URL}/wallpapers/${w.id}`;
      const title = w.title || 'Untitled';
      const downloads = w.download_count || 0;
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
      const imageUrl = resolvedImageUrls[w.id] || `${PROD_URL}/wallpapers/${w.id}/image.jpg`;
      
      md += `${medal} **[${title}](${link})** · ${downloads} downloads\n\n`;
      md += `![${title}](${imageUrl})\n\n`;
    });
    
    // Le reste (4-15)
    if (displayedWallpapers.length > 3) {
      displayedWallpapers.slice(3).forEach((w: any, index: number) => {
        const link = `${PROD_URL}/wallpapers/${w.id}`;
        const title = w.title || 'Untitled';
        const downloads = w.download_count || 0;
        md += `${index + 4}. **[${title}](${link})** · ${downloads} downloads\n`;
      });
      md += `\n`;
    }
    
    if (remainingCount > 0) {
      md += `\n👉 [See ${remainingCount} more new wallpapers](${PROD_URL}/wallpapers)\n\n`;
    }
  }
  
  // Random resource
  if (randomRes) {
    const resLink = `${PROD_URL}/resources/${randomRes.id}`;
    md += `## 🎲 Random Pick from the Archive\n\n`;
    md += `**[${randomRes.title}](${resLink})**\n`;
    md += `> ${randomRes.description?.substring(0, 120)}${randomRes.description?.length > 120 ? '...' : ''}\n\n`;
  }
  
  // Footer
  md += `## 🔗 Quick Links\n\n`;
  md += `- [Browse all resources](${PROD_URL}/resources)\n`;
  md += `- [Wallpaper gallery](${PROD_URL}/wallpapers)\n`;
  md += `- [Community guide](${PROD_URL}/guide)\n`;
  md += `- [Join on Reddit](https://reddit.com/r/xteinkereader)\n`;
  
  return md;
}

/**
 * Génère un slug à partir du pattern
 */
export function generateSlug(pattern: string, weekNumber: number, date: Date): string {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  return pattern
    .replace('{weekNumber}', weekNumber.toString())
    .replace('{date}', dateStr);
}

/**
 * Calcule le numéro de semaine ISO
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
