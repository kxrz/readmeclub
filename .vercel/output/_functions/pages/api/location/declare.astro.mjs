import { s as supabase } from '../../../chunks/client_DiYgajIf.mjs';
import { z } from 'zod';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '../../../chunks/rate-limit_BVj0SoS1.mjs';
export { renderers } from '../../../renderers.mjs';

const declareLocationSchema = z.object({
  country_code: z.string().length(2).regex(/^[A-Z]{2}$/)
  // ISO 3166-1 alpha-2
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = declareLocationSchema.parse(body);
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
    const { data: existing } = await supabase.from("location_declarations").select("id, created_at").eq("country_code", validated.country_code).order("created_at", { ascending: false }).limit(1);
    const { data, error } = await supabase.from("location_declarations").insert({
      country_code: validated.country_code
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
