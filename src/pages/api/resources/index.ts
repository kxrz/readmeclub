export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { cachedQuery, CacheKeys, invalidateCache, pregenerateCache } from '@/lib/supabase/cache';
import { z } from 'zod';

const resourceSchema = z.object({
  type: z.enum(['language_file', 'plugin', 'link', 'documentation', 'tool', 'info', 'other']),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  version: z.string().max(50).optional(),
  compatibility: z.string().max(255).optional(),
  installation_instructions: z.string().optional(),
  known_issues: z.string().optional(),
  file_url: z.string().url().optional(),
  file_name: z.string().max(255).optional(),
  external_link: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  contributor_name: z.string().max(255).optional(),
  contact_info: z.string().max(255).optional(),
  tags: z.array(z.string()).default([]),
});

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const page = Math.floor(offset / limit) + 1;
    
    // Query avec cache
    const { data, error } = await cachedQuery(
      () => {
        let query = supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved')
          .eq('hidden', false)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
        
        if (type) {
          query = query.eq('type', type);
        }
        
        return query;
      },
      {
        key: await CacheKeys.resourcesPage(page, type || undefined),
        ttl: 86400,
        contentType: 'resources',
        parts: [page, limit, type],
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
    const body = await request.json();
    
    // Validate input
    const validated = resourceSchema.parse(body);
    
    // Check rate limit
    const { getIPHash, checkSubmissionLimit, incrementSubmissionCount } = await import('@/lib/utils/rate-limit');
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
    
    // Insert resource
    const { data, error } = await supabase
      .from('resources')
      .insert({
        ...validated,
        status: 'approved', // Resources are approved by default
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
    
    // Invalide le cache et pré-génère les nouveaux caches (en arrière-plan, ne bloque pas la réponse)
    Promise.all([
      invalidateCache('resources'),
      pregenerateCache('resources', supabase),
    ]).catch(err => {
      console.error('Cache invalidation/pre-generation failed:', err);
      // Ne fait pas échouer la requête si le cache échoue
    });
    
    return new Response(JSON.stringify(data), {
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

