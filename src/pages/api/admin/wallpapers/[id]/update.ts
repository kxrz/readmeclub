import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const updateWallpaperSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  hidden: z.boolean().optional(),
  title: z.string().max(60).optional().nullable(),
  category: z.enum(['minimalist', 'dark', 'light', 'pop_culture', 'custom', 'other']).optional().nullable(),
  author_name: z.string().max(50).optional().nullable(),
  reddit_username: z.string().max(30).optional().nullable(),
  instagram_username: z.string().max(30).optional().nullable(),
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
    
    // Validate input
    const validated = updateWallpaperSchema.parse(body);
    
    // Remove undefined values and keep null values for clearing fields
    const updateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('wallpapers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
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
    
    if (error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
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

