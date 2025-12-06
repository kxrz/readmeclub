export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get resource
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .eq('hidden', false)
      .single();
    
    if (resourceError || !resource) {
      return new Response(JSON.stringify({ error: 'Resource not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!resource.file_url) {
      return new Response(JSON.stringify({ error: 'No file available for download' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment download count (async, non-blocking)
    const supabaseAdmin = getSupabaseAdmin();
    try {
      await supabaseAdmin.rpc('increment_resource_downloads', { resource_id: id });
    } catch (error) {
      // Log error but don't block the download
      console.error('Failed to increment download count:', error);
    }
    
    // Fetch file from Supabase Storage or external URL
    let fileResponse: Response;
    
    if (resource.file_url.startsWith('http')) {
      // External URL or Supabase Storage URL
      fileResponse = await fetch(resource.file_url);
    } else {
      // Supabase Storage path
      const { data: fileData } = await supabaseAdmin.storage
        .from('resources')
        .download(resource.file_url);
      
      if (!fileData) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const arrayBuffer = await fileData.arrayBuffer();
      fileResponse = new Response(arrayBuffer);
    }
    
    if (!fileResponse.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch file' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const fileBlob = await fileResponse.blob();
    const fileName = resource.file_name || `resource-${id}`;
    
    return new Response(fileBlob, {
      status: 200,
      headers: {
        'Content-Type': fileBlob.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
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

