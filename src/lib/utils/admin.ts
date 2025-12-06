import type { AstroCookies } from 'astro';

export function checkAdminAuth(cookies: AstroCookies): boolean {
  const adminCookie = cookies.get('admin_session');
  return adminCookie?.value === 'authenticated';
}

export function requireAdmin(cookies: AstroCookies): void {
  if (!checkAdminAuth(cookies)) {
    throw new Error('Unauthorized');
  }
}

