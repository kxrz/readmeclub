import { g as getSupabaseAdmin } from './admin_Ct61RJ0x.mjs';

async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function getIPHash(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return hashIP(ip);
}
async function checkSubmissionLimit(ipHash) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: limit } = await supabaseAdmin.from("submission_limits").select("*").eq("ip_hash", ipHash).single();
  const now = /* @__PURE__ */ new Date();
  const maxSubmissions = 5;
  if (!limit) {
    await supabaseAdmin.from("submission_limits").insert({
      ip_hash: ipHash,
      submission_count: 0,
      reset_at: new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString()
    });
    return { allowed: true, remaining: maxSubmissions };
  }
  const resetAt = new Date(limit.reset_at);
  if (now > resetAt) {
    await supabaseAdmin.from("submission_limits").update({
      submission_count: 0,
      reset_at: new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString()
    }).eq("id", limit.id);
    return { allowed: true, remaining: maxSubmissions };
  }
  const remaining = maxSubmissions - limit.submission_count;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}
async function incrementSubmissionCount(ipHash) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: limit } = await supabaseAdmin.from("submission_limits").select("*").eq("ip_hash", ipHash).single();
  if (limit) {
    await supabaseAdmin.from("submission_limits").update({
      submission_count: limit.submission_count + 1,
      last_submission_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", limit.id);
  }
}

export { checkSubmissionLimit, getIPHash, hashIP, incrementSubmissionCount };
