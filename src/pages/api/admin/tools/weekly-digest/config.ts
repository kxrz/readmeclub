export const prerender = false;

import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const configSchema = z.object({
  enabled: z.boolean().optional(),
  schedule_day: z.number().int().min(0).max(6).optional(),
  schedule_hour: z.number().int().min(0).max(23).optional(),
  schedule_timezone: z.string().optional(),
  period_days: z.number().int().min(1).max(30).optional(),
  author_name: z.string().optional(),
  slug_pattern: z.string().optional(),
  template: z.string().optional().nullable(),
});

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    requireAdmin(cookies);
    
    const body = await request.json();
    const validated = configSchema.parse(body);
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Récupérer la config existante (il n'y en a qu'une)
    const { data: existing } = await supabaseAdmin
      .from('weekly_digest_config')
      .select('id')
      .limit(1)
      .single();
    
    if (existing) {
      // Mettre à jour
      const { data, error } = await supabaseAdmin
        .from('weekly_digest_config')
        .update(validated)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      // Créer
      const { data, error } = await supabaseAdmin
        .from('weekly_digest_config')
        .insert(validated)
        .select()
        .single();
      
      if (error) throw error;
      return new Response(JSON.stringify(data), { status: 201 });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Validation error', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: error.message || 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
