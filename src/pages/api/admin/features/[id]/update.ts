import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/utils/admin';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const updateFeatureSchema = z.object({
  admin_status: z.enum(['pending', 'planned', 'completed', 'rejected']).optional(),
  hidden: z.boolean().optional(),
  title: z.string().min(1).max(80).optional(),
  description: z.string().min(1).max(500).optional(),
  reddit_username: z.string().max(30).optional().nullable(),
  tags: z.array(z.string()).optional(),
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
    const validated = updateFeatureSchema.parse(body);
    
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
      .from('feature_requests')
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

