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
    let width = 0;
    let height = 0;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Simple dimension detection for common formats
      if (fileExtension === 'png') {
        // PNG: bytes 16-23 contain width and height (32-bit each, big-endian)
        width = buffer.readUInt32BE(16);
        height = buffer.readUInt32BE(20);
      } else if (['jpg', 'jpeg'].includes(fileExtension)) {
        // JPEG: more complex, need to parse markers
        // For now, we'll use a library or set default
        // Using a simple approach: try to read dimensions from EXIF or SOF markers
        let i = 0;
        while (i < buffer.length - 8) {
          if (buffer[i] === 0xFF && buffer[i + 1] === 0xC0) {
            // SOF0 marker found
            height = buffer.readUInt16BE(i + 5);
            width = buffer.readUInt16BE(i + 7);
            break;
          }
          i++;
        }
      }
      
      // Fallback: if dimensions not detected, use a default or try to load image
      if (width === 0 || height === 0) {
        // For SVG or if detection failed, we'll set defaults
        // In production, you might want to use sharp or jimp to get dimensions
        width = 1920; // Default fallback
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

