import { g as getSupabaseAdmin } from '../../../chunks/admin_Ct61RJ0x.mjs';
import { readFileSync } from 'fs';
import { join } from 'path';
export { renderers } from '../../../renderers.mjs';

const GET = async () => {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    try {
      const { data: analytics } = await supabaseAdmin.from("analytics").select("id, pdf_v2_downloads").single();
      if (analytics) {
        await supabaseAdmin.from("analytics").update({ pdf_v2_downloads: (analytics.pdf_v2_downloads || 0) + 1 }).eq("id", analytics.id);
      }
    } catch (error) {
      console.error("Error incrementing PDF download count:", error);
    }
    const filePath = join(process.cwd(), "public", "guide", "Xteink_X4_Community_Guide_v2.pdf");
    const fileBuffer = readFileSync(filePath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Xteink_X4_Community_Guide_v2.pdf"',
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    console.error("Error serving PDF guide:", error);
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
