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
    
    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: 'File too large (max 10MB)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Validate file format - only images
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    
    const fileType = file.type;
    const fileLowerCaseName = file.name.toLowerCase();
    const fileExtension = fileLowerCaseName.substring(fileLowerCaseName.lastIndexOf('.') + 1);
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    
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
    
    // Get image dimensions
    // For now, we'll use default dimensions and let the admin update them if needed
    // Reading image dimensions from binary data can be problematic in serverless environments
    // A better approach would be to use a library like 'sharp' or 'image-size' if needed
    let width = 1920; // Default fallback
    let height = 1080;
    
    // Try to detect dimensions using DataView (more compatible with serverless)
    try {
      const arrayBuffer = await file.arrayBuffer();
      const view = new DataView(arrayBuffer);
      
      // Simple dimension detection for PNG (bytes 16-23 contain width and height)
      if (fileExtension === 'png' && arrayBuffer.byteLength >= 24) {
        width = view.getUint32(16, false); // big-endian
        height = view.getUint32(20, false); // big-endian
      } else if (['jpg', 'jpeg'].includes(fileExtension) && arrayBuffer.byteLength >= 20) {
        // JPEG: look for SOF0 marker (0xFF 0xC0)
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < uint8Array.length - 8; i++) {
          if (uint8Array[i] === 0xFF && uint8Array[i + 1] === 0xC0) {
            height = view.getUint16(i + 5, false);
            width = view.getUint16(i + 7, false);
            break;
          }
        }
      }
      
      // Validate detected dimensions
      if (width === 0 || height === 0 || width > 10000 || height > 10000) {
        width = 1920;
        height = 1080;
      }
    } catch (error) {
      console.error('Error reading image dimensions:', error);
      // Fallback dimensions
      width = 1920;
      height = 1080;
    }
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('wallpapers')
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
      .from('wallpapers')
      .getPublicUrl(uploadData.path);
    
    // Increment submission count
    await incrementSubmissionCount(ipHash);
    
    return new Response(JSON.stringify({ 
      url: publicUrl,
      path: uploadData.path,
      fileName: file.name,
      fileSize: file.size,
      width,
      height,
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

