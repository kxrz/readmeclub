export const prerender = false;

import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/utils/admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    requireAdmin(cookies);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (max 5MB for featured images)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large (max 5MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file format - only images
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/gif',
    ];

    const fileType = file.type;
    const fileLowerCaseName = file.name.toLowerCase();
    const fileExtension = fileLowerCaseName.substring(fileLowerCaseName.lastIndexOf('.') + 1);
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

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

    // Upload to Supabase Storage bucket "news-images"
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('news-images')
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
      .from('news-images')
      .getPublicUrl(uploadData.path);

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

