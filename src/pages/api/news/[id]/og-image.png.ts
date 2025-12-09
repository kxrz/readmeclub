export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase/client';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response('ID required', { status: 400 });
    }
    
    // Fetch article
    const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .eq('hidden', false)
      .single();
    
    if (error || !article) {
      return new Response('Article not found', { status: 404 });
    }
    
    const title = article.title || 'News Article';
    const excerpt = article.excerpt || '';
    
    // Generate OG image
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '24px',
                  color: '#666666',
                  marginBottom: '20px',
                  fontWeight: 500,
                },
                children: 'readme.club',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#000000',
                  lineHeight: 1.2,
                  marginBottom: '30px',
                  maxWidth: '1080px',
                },
                children: title,
              },
            },
            excerpt ? {
              type: 'div',
              props: {
                style: {
                  fontSize: '32px',
                  color: '#666666',
                  lineHeight: 1.5,
                  maxWidth: '1080px',
                },
                children: excerpt,
              },
            } : null,
          ].filter(Boolean),
        },
      },
      {
        width: 1200,
        height: 630,
      }
    );
    
    const resvg = new Resvg(svg);
    const pngData = resvg.render().asPng();
    
    return new Response(pngData, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('OG image generation error:', error);
    return new Response('Error generating image', { status: 500 });
  }
};

