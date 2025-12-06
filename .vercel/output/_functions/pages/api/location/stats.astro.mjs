import { s as supabase } from '../../../chunks/client_DiYgajIf.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  try {
    const { data, error } = await supabase.from("location_declarations").select("country_code").order("created_at", { ascending: false });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const stats = {};
    if (data) {
      for (const declaration of data) {
        const code = declaration.country_code.toUpperCase();
        stats[code] = (stats[code] || 0) + 1;
      }
    }
    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
    return new Response(JSON.stringify({
      stats,
      total,
      countries: Object.keys(stats).length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
