import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { join } from 'path';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const fileName = params.file;
    
    if (!fileName) {
      return new Response(JSON.stringify({ error: 'File name required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Security: Only allow files from fonts directory
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return new Response(JSON.stringify({ error: 'Invalid file name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Read file from public/fonts directory
    const filePath = join(process.cwd(), 'public', 'fonts', fileName);
    
    let fileBuffer: Buffer;
    try {
      fileBuffer = readFileSync(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
    
    // Determine content type based on file extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      'bin': 'application/octet-stream',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
    };
    const contentType = contentTypeMap[extension || ''] || 'application/octet-stream';
    
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Error serving font file:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

