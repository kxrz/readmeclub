export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '@/lib/utils/rate-limit';

const declareLocationSchema = z.object({
  country_code: z.string().length(2).regex(/^[A-Z]{2}$/), // ISO 3166-1 alpha-2
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = declareLocationSchema.parse(body);
    
    // Check rate limit (1 declaration per IP per day)
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
    
    // Check if this IP has already declared a location today
    const { data: existing } = await supabase
      .from('location_declarations')
      .select('id, created_at')
      .eq('country_code', validated.country_code)
      .order('created_at', { ascending: false })
      .limit(1);
    
    // Insert location declaration
    const { data, error } = await supabase
      .from('location_declarations')
      .insert({
        country_code: validated.country_code,
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

