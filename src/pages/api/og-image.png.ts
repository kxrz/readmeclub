export const prerender = false;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function loadFonts() {
  const fontRegular = readFileSync(join(process.cwd(), 'public', 'fonts', 'inter-400.woff'));
  const fontBold = readFileSync(join(process.cwd(), 'public', 'fonts', 'inter-700.woff'));

  return [
    {
      name: 'Inter',
      data: fontRegular,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'Inter',
      data: fontBold,
      weight: 700,
      style: 'normal',
    },
  ];
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const title = url.searchParams.get('title') || 'readme.club';
    const description = url.searchParams.get('description') || '';
    
    // Charger les polices
    const fonts = await loadFonts();
    
    // Generate OG image with Satori - style minimaliste
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            background: '#ffffff',
            padding: '60px',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          },
          children: [
            // Logo en haut à gauche
            {
              type: 'div',
              props: {
                style: {
                  fontSize: '18px',
                  fontWeight: '400',
                  color: '#000000',
                  marginBottom: 'auto',
                },
                children: 'readme.club',
              },
            },
            // Contenu centré verticalement
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  flex: 1,
                  maxWidth: '900px',
                  margin: '0 auto',
                },
                children: [
                  // Titre
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#000000',
                        lineHeight: '1.2',
                        marginBottom: description ? '24px' : '0',
                      },
                      children: title,
                    },
                  },
                  // Description
                  ...(description ? [{
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '24px',
                        fontWeight: '400',
                        color: '#666666',
                        lineHeight: '1.5',
                        maxWidth: '800px',
                      },
                      children: description.length > 200 ? description.substring(0, 200) + '...' : description,
                    },
                  }] : []),
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts,
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

