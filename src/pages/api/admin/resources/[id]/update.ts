export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { invalidateCache, pregenerateCache } from '@/lib/supabase/cache';
import { z } from 'zod';

const updateResourceSchema = z.object({
  type: z.enum(['language_file', 'plugin', 'link', 'documentation', 'tool', 'info', 'other']).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  version: z.string().max(50).optional().nullable(),
  compatibility: z.string().max(255).optional().nullable(),
  installation_instructions: z.string().optional().nullable(),
  known_issues: z.string().optional().nullable(),
  file_url: z.string().url().optional().nullable(),
  file_name: z.string().max(255).optional().nullable(),
  external_link: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  contributor_name: z.string().max(255).optional().nullable(),
  contact_info: z.string().max(255).optional().nullable(),
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
    const validated = updateResourceSchema.parse(body);
    
    // Remove undefined values and keep null values for clearing fields
    const updateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('resources')
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
    
    // Invalide le cache car n'importe quel champ peut affecter l'affichage
    Promise.all([
      invalidateCache('resources'),
      pregenerateCache('resources', supabaseAdmin),
    ]).catch(err => {
      console.error('Cache invalidation/pre-generation failed:', err);
    });
    
    return new Response(JSON.stringify({ success: true, data }), {
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

