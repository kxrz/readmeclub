import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getGradientForId } from '@/lib/utils/gradients';

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get('title') || 'Readme.club';
    const description = url.searchParams.get('description') || '';
    
    // Générer un gradient unique basé sur le titre
    const gradient = getGradientForId(title);
    
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
                  marginBottom: description ? '40px' : '0',
                  lineHeight: '1.2',
                  maxWidth: '1000px',
                },
                children: title,
              },
            },
            ...(description ? [{
              type: 'div',
              props: {
                style: {
                  fontSize: '32px',
                  color: '#f0f0f0',
                  textAlign: 'center',
                  maxWidth: '900px',
                  lineHeight: '1.5',
                  marginTop: '20px',
                },
                children: description.length > 150 ? description.substring(0, 150) + '...' : description,
              },
            }] : []),
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

