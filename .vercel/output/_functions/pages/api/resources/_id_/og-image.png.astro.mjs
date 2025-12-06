import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { s as supabase } from '../../../../chunks/client_DiYgajIf.mjs';
import { readFileSync } from 'fs';
import { join } from 'path';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
async function loadFonts() {
  const fontRegular = readFileSync(join(process.cwd(), "public", "fonts", "inter-400.woff"));
  const fontBold = readFileSync(join(process.cwd(), "public", "fonts", "inter-700.woff"));
  return [
    {
      name: "Inter",
      data: fontRegular,
      weight: 400,
      style: "normal"
    },
    {
      name: "Inter",
      data: fontBold,
      weight: 700,
      style: "normal"
    }
  ];
}
const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response("ID required", { status: 400 });
    }
    const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single();
    if (!resource) {
      return new Response("Resource not found", { status: 404 });
    }
    const fonts = await loadFonts();
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            width: "1200px",
            height: "630px",
            background: "#ffffff",
            padding: "60px",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif"
          },
          children: [
            // Logo en haut à gauche
            {
              type: "div",
              props: {
                style: {
                  fontSize: "18px",
                  fontWeight: "400",
                  color: "#000000",
                  marginBottom: "auto"
                },
                children: "readme.club"
              }
            },
            // Contenu centré verticalement
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  flex: 1,
                  maxWidth: "900px",
                  margin: "0 auto"
                },
                children: [
                  // Titre
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "64px",
                        fontWeight: "bold",
                        color: "#000000",
                        lineHeight: "1.2",
                        marginBottom: "24px"
                      },
                      children: resource.title
                    }
                  },
                  // Description
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "24px",
                        fontWeight: "400",
                        color: "#666666",
                        lineHeight: "1.5",
                        maxWidth: "800px"
                      },
                      children: resource.description.substring(0, 200) + (resource.description.length > 200 ? "..." : "")
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        width: 1200,
        height: 630,
        fonts
      }
    );
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: 1200
      }
    });
    const pngBuffer = resvg.render().asPng();
    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response("Error generating image", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
