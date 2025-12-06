import { s as supabase } from '../../../chunks/client_DiYgajIf.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    const { data: wallpapers, error } = await supabase.from("wallpapers").select("id").eq("status", "published").eq("hidden", false);
    if (error || !wallpapers || wallpapers.length === 0) {
      return new Response(JSON.stringify({ error: "No wallpapers found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const randomIndex = Math.floor(Math.random() * wallpapers.length);
    const randomWallpaper = wallpapers[randomIndex];
    const referer = request.headers.get("referer") || "";
    const url = new URL(request.url);
    let langPrefix = "";
    const refererMatch = referer.match(/\/(fr|es|ru|cn)\//);
    const urlMatch = url.pathname.match(/\/(fr|es|ru|cn)\//);
    if (refererMatch) {
      langPrefix = `/${refererMatch[1]}`;
    } else if (urlMatch) {
      langPrefix = `/${urlMatch[1]}`;
    }
    return new Response(null, {
      status: 302,
      headers: {
        "Location": `${langPrefix}/wallpapers/${randomWallpaper.id}`
      }
    });
  } catch (error) {
    console.error("Error getting random wallpaper:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
