import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { supabase } from '@/lib/supabase/client';
import { getGradientForId } from '@/lib/utils/gradients';

export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;
    
    if (!id) {
      return new Response('ID required', { status: 400 });
    }
    
    const { data: wallpaper } = await supabase
      .from('wallpapers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!wallpaper) {
      return new Response('Wallpaper not found', { status: 404 });
    }
    
    // Générer un gradient unique pour ce wallpaper
    const gradient = getGradientForId(wallpaper.id);
    
    // Generate OG image with Satori
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1200px',
            height: '630px',
            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
          children: [
            {
              type: 'div',
              props: {
              style: {
                fontSize: '72px',
                fontWeight: 'bold',
                color: gradient.text,
                textAlign: 'center',
                marginBottom: '40px',
                lineHeight: '1.2',
                maxWidth: '1000px',
              },
                children: wallpaper.title || 'Wallpaper',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '24px',
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                },
                children: wallpaper.category ? wallpaper.category.replace('_', ' ') : 'Wallpaper',
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [],
      }
    );
    
    // Convert SVG to PNG
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });
    const pngBuffer = resvg.render().asPng();
    
    return new Response(pngBuffer, {
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

