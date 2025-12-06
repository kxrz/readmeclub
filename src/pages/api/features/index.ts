import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '@/lib/utils/rate-limit';

const featureRequestSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  reddit_username: z.string().max(30).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

export const GET: APIRoute = async ({ url }) => {
  try {
    const status = url.searchParams.get('status') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    let query = supabase
      .from('feature_requests')
      .select('*')
      .eq('status', 'published')
      .eq('hidden', false)
      .order('votes_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status !== 'all') {
      query = query.eq('admin_status', status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ data: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
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
    const validated = featureRequestSchema.parse(body);
    
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
    
    // Insert feature request
    const { data, error } = await supabase
      .from('feature_requests')
      .insert({
        title: validated.title,
        description: validated.description,
        reddit_username: validated.reddit_username || null,
        tags: validated.tags || [],
        status: 'published',
        admin_status: 'pending',
        votes_count: 0,
        warnings_count: 0,
        hidden: false,
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

