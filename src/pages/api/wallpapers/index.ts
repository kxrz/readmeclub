export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { cachedQuery, CacheKeys, invalidateCache, pregenerateCache } from '@/lib/supabase/cache';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '@/lib/utils/rate-limit';
import { triggerVercelRebuild } from '@/lib/utils/vercel-rebuild';

const wallpaperSchema = z.object({
  title: z.string().max(60).optional(),
  category: z.enum(['minimalist', 'dark', 'light', 'pop_culture', 'custom', 'other']).optional(),
  author_name: z.string().max(50).optional(),
  reddit_username: z.string().max(30).optional(),
  instagram_username: z.string().max(30).optional(),
  file_url: z.string().url(),
  file_name: z.string().max(255),
  file_size: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const page = Math.floor(offset / limit) + 1;
    
    // Query avec cache
    const { data, error } = await cachedQuery(
      () => {
        let query = supabase
          .from('wallpapers')
          .select('*')
          .eq('status', 'published')
          .eq('hidden', false)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (category) {
          query = query.eq('category', category);
        }
        
        return query;
      },
      {
        key: await CacheKeys.wallpapersPage(page, category || undefined, 'latest'),
        ttl: 86400,
        contentType: 'wallpapers',
        parts: [page, limit, category],
      }
    );
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check rate limit
    const ipHash = await getIPHash(request);
    const limitCheck = await checkSubmissionLimit(ipHash);
    
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        remaining: limitCheck.remaining 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const body = await request.json();
    
    // Validate input
    const validated = wallpaperSchema.parse(body);
    
    // Insert wallpaper
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .insert({
        ...validated,
        status: 'published', // Par défaut publié (modération manuelle si nécessaire)
        hidden: false,
        submitted_ip_hash: ipHash,
        pending_export: true, // Marqué comme en attente d'export (batch processing)
        download_count: 0, // Compteur de téléchargements initialisé à 0
      })
      .select()
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment submission count
    await incrementSubmissionCount(ipHash);
    
    // Vérifier si on doit déclencher un batch (en arrière-plan, ne bloque pas)
    Promise.all([
      invalidateCache('wallpapers'),
      (async () => {
        const { checkAndTriggerBatch } = await import('@/lib/utils/wallpaper-batch');
        await checkAndTriggerBatch();
      })(),
    ]).catch(err => {
      console.error('Cache invalidation/batch check failed:', err);
    });
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ 
        error: 'Validation error',
        details: error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

