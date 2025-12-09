export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { requireAdmin } from '@/lib/utils/admin';

const newsSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1),
  featured_image_url: z.string().url().optional().nullable(),
  author_name: z.string().max(100).optional().nullable(),
  author_email: z.string().email().optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  published_at: z.string().datetime().optional().nullable(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAdmin(cookies);

    const body = await request.json();
    const validated = newsSchema.parse(body);

    const supabaseAdmin = getSupabaseAdmin();

    // If published_at is not provided and status is published, set it to now
    if (validated.status === 'published' && !validated.published_at) {
      validated.published_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert({
        ...validated,
        published_at: validated.published_at || null,
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

