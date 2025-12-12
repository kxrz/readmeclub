import type { Resource, Wallpaper } from '@/lib/supabase/schema';

/**
 * Get the display name for a resource contributor.
 * Falls back to contact_info if contributor_name is not provided.
 */
export function getResourceContributorName(resource: Resource): string | undefined {
  if (resource.contributor_name) {
    return resource.contributor_name;
  }
  
  // Fallback to contact_info if it looks like a username
  if (resource.contact_info) {
    // Check if contact_info looks like a username (starts with @ or contains common username patterns)
    const contact = resource.contact_info.trim();
    if (contact.startsWith('@') || contact.startsWith('u/') || contact.startsWith('github.com/') || contact.startsWith('twitter.com/') || contact.startsWith('reddit.com/user/')) {
      return contact;
    }
    // If it's a simple string without @ or special characters, it might be a name
    if (!contact.includes('@') && !contact.includes('://')) {
      return contact;
    }
  }
  
  return undefined;
}

/**
 * Get the display name for a wallpaper author.
 * Falls back to reddit_username or instagram_username if author_name is not provided.
 */
export function getWallpaperAuthorName(wallpaper: Wallpaper): string | undefined {
  if (wallpaper.author_name) {
    return wallpaper.author_name;
  }
  
  // Fallback to reddit_username
  if (wallpaper.reddit_username) {
    return `u/${wallpaper.reddit_username}`;
  }
  
  // Fallback to instagram_username
  if (wallpaper.instagram_username) {
    return `@${wallpaper.instagram_username}`;
  }
  
  return undefined;
}

