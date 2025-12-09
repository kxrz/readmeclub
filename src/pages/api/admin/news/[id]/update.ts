export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { requireAdmin } from '@/lib/utils/admin';

const newsUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1).optional(),
  featured_image_url: z.string().url().optional().nullable(),
  author_name: z.string().max(100).optional().nullable(),
  author_email: z.string().email().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  published_at: z.string().datetime().optional().nullable(),
  hidden: z.boolean().optional(),
});

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    requireAdmin(cookies);

    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const validated = newsUpdateSchema.parse(body);

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'Article not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
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

