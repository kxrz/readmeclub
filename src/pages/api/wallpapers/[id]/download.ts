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
    
    // Get wallpaper
    const { data: wallpaper, error: wallpaperError } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (wallpaperError || !wallpaper) {
      return new Response(JSON.stringify({ error: 'Wallpaper not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!wallpaper.file_url) {
      return new Response(JSON.stringify({ error: 'No file available for download' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Increment download count (async, non-blocking)
    const supabaseAdmin = getSupabaseAdmin();
    try {
      await supabaseAdmin.rpc('increment_wallpaper_downloads', { wallpaper_id: id });
    } catch (error) {
      // Log error but don't block the download
      console.error('Failed to increment download count:', error);
    }
    
    // Fetch file from Supabase Storage or external URL
    let fileResponse: Response;
    
    if (wallpaper.file_url.startsWith('http')) {
      // External URL - fetch directly
      fileResponse = await fetch(wallpaper.file_url);
      
      if (!fileResponse.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch file' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Supabase Storage path
      const pathParts = wallpaper.file_url.split('/storage/v1/object/public/');
      if (pathParts.length < 2) {
        return new Response(JSON.stringify({ error: 'Invalid file URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const storagePath = pathParts[1];
      const [bucket, ...filePathParts] = storagePath.split('/');
      const filePath = filePathParts.join('/');
      
      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from(bucket)
        .download(filePath);
      
      if (downloadError || !fileData) {
        return new Response(JSON.stringify({ error: 'Failed to download file' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const arrayBuffer = await fileData.arrayBuffer();
      fileResponse = new Response(arrayBuffer);
    }
    
    // Determine content type
    const fileName = wallpaper.file_name || 'wallpaper.jpg';
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
    };
    const contentType = contentTypeMap[fileExtension] || 'image/jpeg';
    
    // Return file with proper headers
    const fileBlob = await fileResponse.blob();
    const fileArrayBuffer = await fileBlob.arrayBuffer();
    
    return new Response(fileArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileArrayBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

