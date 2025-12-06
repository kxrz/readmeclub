import { s as supabase } from '../../chunks/client_DiYgajIf.mjs';
import { z } from 'zod';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const resourceSchema = z.object({
  type: z.enum(["language_file", "plugin", "link", "documentation", "tool", "info", "other"]),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  version: z.string().max(50).optional(),
  compatibility: z.string().max(255).optional(),
  installation_instructions: z.string().optional(),
  known_issues: z.string().optional(),
  file_url: z.string().url().optional(),
  file_name: z.string().max(255).optional(),
  external_link: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  contributor_name: z.string().max(255).optional(),
  contact_info: z.string().max(255).optional(),
  tags: z.array(z.string()).default([])
});
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    let query = supabase.from("resources").select("*").eq("status", "approved").eq("hidden", false).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (type) {
      query = query.eq("type", type);
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
    const body = await request.json();
    const validated = resourceSchema.parse(body);
    const { getIPHash, checkSubmissionLimit, incrementSubmissionCount } = await import('../../chunks/rate-limit_BVj0SoS1.mjs');
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
    const { data, error } = await supabase.from("resources").insert({
      ...validated,
      status: "approved"
      // Resources are approved by default
    }).select().single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    await incrementSubmissionCount(ipHash);
    return new Response(JSON.stringify(data), {
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
