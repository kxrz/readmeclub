export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '@/lib/utils/rate-limit';

export const POST: APIRoute = async ({ request }) => {
  try {
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
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large (max 50MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file format
    const allowedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/pdf',
      'application/epub+zip',
      'application/x-epub+zip',
      'text/plain',
      'text/html',
      'application/javascript',
      'text/css',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/x-font-ttf',
      'application/x-font-truetype',
      'font/ttf',
      'font/otf',
      'application/vnd.ms-fontobject',
      'font/woff',
      'font/woff2',
    ];
    
    const fileType = file.type;
    const fileLowerCaseName = file.name.toLowerCase();
    const fileExtension = fileLowerCaseName.substring(fileLowerCaseName.lastIndexOf('.') + 1);
    const allowedExtensions = ['zip', 'rar', '7z', 'pdf', 'epub', 'txt', 'html', 'htm', 'js', 'css', 'json', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'eot', 'woff', 'woff2', 'bin'];
    
    const isValidType = fileType && allowedTypes.includes(fileType);
    const isValidExtension = allowedExtensions.includes(fileExtension);
    
    if (!isValidType && !isValidExtension) {
      return new Response(JSON.stringify({ 
        error: `File type not allowed. Allowed formats: ${allowedExtensions.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('resources')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });
    
    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('resources')
      .getPublicUrl(uploadData.path);
    
    // Increment submission count
    await incrementSubmissionCount(ipHash);
    
    return new Response(JSON.stringify({ 
      url: publicUrl,
      path: uploadData.path,
      fileName: file.name,
      fileSize: file.size,
    }), {
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

