import { r as requireAdmin } from '../../../../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../../../../chunks/admin_Ct61RJ0x.mjs';
import { z } from 'zod';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const updateResourceSchema = z.object({
  type: z.enum(["language_file", "plugin", "link", "documentation", "tool", "info", "other"]).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  version: z.string().max(50).optional().nullable(),
  compatibility: z.string().max(255).optional().nullable(),
  installation_instructions: z.string().optional().nullable(),
  known_issues: z.string().optional().nullable(),
  file_url: z.string().url().optional().nullable(),
  file_name: z.string().max(255).optional().nullable(),
  external_link: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  contributor_name: z.string().max(255).optional().nullable(),
  contact_info: z.string().max(255).optional().nullable()
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
    const validated = updateResourceSchema.parse(body);
    const updateData = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value !== void 0) {
        updateData[key] = value;
      }
    }
    updateData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from("resources").update(updateData).eq("id", id).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true, data }), {
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
  PUT,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
