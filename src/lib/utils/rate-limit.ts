import { getSupabaseAdmin } from '../supabase/admin';
import type { Request } from 'astro';

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function getIPHash(request: Request): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return hashIP(ip);
}

export async function checkSubmissionLimit(ipHash: string): Promise<{ allowed: boolean; remaining: number }> {
  const supabaseAdmin = getSupabaseAdmin();
  
  // Check if limit exists
  const { data: limit } = await supabaseAdmin
    .from('submission_limits')
    .select('*')
    .eq('ip_hash', ipHash)
    .single();
  
  const now = new Date();
  const maxSubmissions = 5; // Max 5 submissions per 24h
  
  if (!limit) {
    // Create new limit
    await supabaseAdmin
      .from('submission_limits')
      .insert({
        ip_hash: ipHash,
        submission_count: 0,
        reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    
    return { allowed: true, remaining: maxSubmissions };
  }
  
  // Check if reset time has passed
  const resetAt = new Date(limit.reset_at);
  if (now > resetAt) {
    // Reset limit
    await supabaseAdmin
      .from('submission_limits')
      .update({
        submission_count: 0,
        reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', limit.id);
    
    return { allowed: true, remaining: maxSubmissions };
  }
  
  const remaining = maxSubmissions - limit.submission_count;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}

export async function incrementSubmissionCount(ipHash: string): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin();
  
  const { data: limit } = await supabaseAdmin
    .from('submission_limits')
    .select('*')
    .eq('ip_hash', ipHash)
    .single();
  
  if (limit) {
    await supabaseAdmin
      .from('submission_limits')
      .update({
        submission_count: limit.submission_count + 1,
        last_submission_at: new Date().toISOString(),
      })
      .eq('id', limit.id);
  }
}

