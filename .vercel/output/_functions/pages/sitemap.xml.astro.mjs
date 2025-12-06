import { s as supabase } from '../chunks/client_DiYgajIf.mjs';
export { renderers } from '../renderers.mjs';

const siteUrl = "https://readme.club";
const locales = ["en", "fr", "es", "ru", "cn"];
const staticPages = [
  "",
  "resources",
  "wallpapers",
  "fonts",
  "tips",
  "board",
  "location",
  "guide",
  "disclaimer",
  "submit"
];
const GET = async () => {
  const urls = [];
  for (const locale of locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    for (const page of staticPages) {
      urls.push(`${siteUrl}${prefix}${page ? `/${page}` : ""}`);
    }
  }
  try {
    const { data: resources } = await supabase.from("resources").select("id").eq("status", "approved").eq("hidden", false);
    if (resources) {
      for (const locale of locales) {
        const prefix = locale === "en" ? "" : `/${locale}`;
        for (const resource of resources) {
          urls.push(`${siteUrl}${prefix}/resources/${resource.id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching resources for sitemap:", error);
  }
  try {
    const { data: wallpapers } = await supabase.from("wallpapers").select("id").eq("status", "published").eq("hidden", false);
    if (wallpapers) {
      for (const locale of locales) {
        const prefix = locale === "en" ? "" : `/${locale}`;
        for (const wallpaper of wallpapers) {
          urls.push(`${siteUrl}${prefix}/wallpapers/${wallpaper.id}`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching wallpapers for sitemap:", error);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join("\n")}
</urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
