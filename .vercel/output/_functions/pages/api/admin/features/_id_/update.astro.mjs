import { r as requireAdmin } from '../../../../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../../../../chunks/admin_Ct61RJ0x.mjs';
import { z } from 'zod';
export { renderers } from '../../../../../renderers.mjs';

const updateFeatureSchema = z.object({
  admin_status: z.enum(["pending", "planned", "completed", "rejected"]).optional(),
  hidden: z.boolean().optional(),
  title: z.string().min(1).max(80).optional(),
  description: z.string().min(1).max(500).optional(),
  reddit_username: z.string().max(30).optional().nullable(),
  tags: z.array(z.string()).optional()
});
const PUT = async ({ params, request, cookies }) => {
  try {
    requireAdmin(cookies);
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const validated = updateFeatureSchema.parse(body);
    const updateData = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value !== void 0) {
        updateData[key] = value;
      }
    }
    updateData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from("feature_requests").update(updateData).eq("id", id).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: "Validation error",
        details: error.errors
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
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
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
