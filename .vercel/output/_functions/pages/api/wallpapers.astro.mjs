import { s as supabase } from '../../chunks/client_DiYgajIf.mjs';
import { g as getSupabaseAdmin } from '../../chunks/admin_Ct61RJ0x.mjs';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '../../chunks/rate-limit_BVj0SoS1.mjs';
export { renderers } from '../../renderers.mjs';

const wallpaperSchema = z.object({
  title: z.string().max(60).optional(),
  category: z.enum(["minimalist", "dark", "light", "pop_culture", "custom", "other"]).optional(),
  author_name: z.string().max(50).optional(),
  reddit_username: z.string().max(30).optional(),
  instagram_username: z.string().max(30).optional(),
  file_url: z.string().url(),
  file_name: z.string().max(255),
  file_size: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query = supabase.from("wallpapers").select("*").eq("status", "published").eq("hidden", false).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (category) {
      query = query.eq("category", category);
    }
    const { data, error } = await query;
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
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const ipHash = await getIPHash(request);
    const limitCheck = await checkSubmissionLimit(ipHash);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        remaining: limitCheck.remaining
      }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const validated = wallpaperSchema.parse(body);
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from("wallpapers").insert({
      ...validated,
      status: "published",
      // Par défaut publié
      hidden: false,
      submitted_ip_hash: ipHash
    }).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    await incrementSubmissionCount(ipHash);
    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
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
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
