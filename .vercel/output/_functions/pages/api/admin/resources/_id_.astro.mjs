import { r as requireAdmin } from '../../../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../../../chunks/admin_Ct61RJ0x.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async ({ params, cookies }) => {
  try {
    requireAdmin(cookies);
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from("resources").select("*").eq("id", id).single();
    if (error || !data) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
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
