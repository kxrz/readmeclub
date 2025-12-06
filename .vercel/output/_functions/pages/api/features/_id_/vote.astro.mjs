import { g as getSupabaseAdmin } from '../../../../chunks/admin_Ct61RJ0x.mjs';
import { getIPHash } from '../../../../chunks/rate-limit_BVj0SoS1.mjs';
export { renderers } from '../../../../renderers.mjs';

const POST = async ({ params, request }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ipHash = await getIPHash(request);
    const supabaseAdmin = getSupabaseAdmin();
    const { data: existingVote } = await supabaseAdmin.from("feature_votes").select("id").eq("feature_request_id", id).eq("ip_hash", ipHash).single();
    if (existingVote) {
      return new Response(JSON.stringify({
        error: "You have already voted for this feature request",
        already_voted: true
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: featureRequest, error: fetchError } = await supabaseAdmin.from("feature_requests").select("id, votes_count, status, hidden").eq("id", id).single();
    if (fetchError || !featureRequest) {
      return new Response(JSON.stringify({ error: "Feature request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (featureRequest.status !== "published" || featureRequest.hidden) {
      return new Response(JSON.stringify({ error: "Feature request is not available for voting" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { error: voteError } = await supabaseAdmin.from("feature_votes").insert({
      feature_request_id: id,
      ip_hash: ipHash
    });
    if (voteError) {
      return new Response(JSON.stringify({ error: voteError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: updated, error: updateError } = await supabaseAdmin.from("feature_requests").update({ votes_count: featureRequest.votes_count + 1 }).eq("id", id).select("votes_count").single();
    if (updateError) {
      console.error("Error updating votes count:", updateError);
    }
    return new Response(JSON.stringify({
      success: true,
      votes_count: updated?.votes_count || featureRequest.votes_count + 1
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
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
