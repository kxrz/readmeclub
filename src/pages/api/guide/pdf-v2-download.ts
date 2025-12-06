import type { APIRoute } from 'astro';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: APIRoute = async () => {
  try {
    // Increment download count (async, non-blocking)
    const supabaseAdmin = getSupabaseAdmin();
    try {
      const { data: analytics } = await supabaseAdmin
        .from('analytics')
        .select('id, pdf_v2_downloads')
        .single();
      
      if (analytics) {
        await supabaseAdmin
          .from('analytics')
          .update({ pdf_v2_downloads: (analytics.pdf_v2_downloads || 0) + 1 })
          .eq('id', analytics.id);
      }
    } catch (error) {
      // Log error but don't block the download
      console.error('Error incrementing PDF download count:', error);
    }
    
    // Read file from public/guide directory
    const filePath = join(process.cwd(), 'public', 'guide', 'Xteink_X4_Community_Guide_v2.pdf');
    const fileBuffer = readFileSync(filePath);
    
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Xteink_X4_Community_Guide_v2.pdf"',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Error serving PDF guide:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

