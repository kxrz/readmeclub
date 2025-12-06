import { s as supabase } from '../../chunks/client_DiYgajIf.mjs';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '../../chunks/rate-limit_BVj0SoS1.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const featureRequestSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(500),
  reddit_username: z.string().max(30).optional().nullable(),
  tags: z.array(z.string()).optional().default([])
});
const GET = async ({ url }) => {
  try {
    const status = url.searchParams.get("status") || "all";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query = supabase.from("feature_requests").select("*").eq("status", "published").eq("hidden", false).order("votes_count", { ascending: false }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (status !== "all") {
      query = query.eq("admin_status", status);
    }
    const { data, error } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ data: data || [] }), {
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
    const body = await request.json();
    const validated = featureRequestSchema.parse(body);
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
    const { data, error } = await supabase.from("feature_requests").insert({
      title: validated.title,
      description: validated.description,
      reddit_username: validated.reddit_username || null,
      tags: validated.tags || [],
      status: "published",
      admin_status: "pending",
      votes_count: 0,
      warnings_count: 0,
      hidden: false
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
