import { s as supabase } from '../../../../chunks/client_DiYgajIf.mjs';
import { g as getSupabaseAdmin } from '../../../../chunks/admin_Ct61RJ0x.mjs';
export { renderers } from '../../../../renderers.mjs';

const GET = async ({ params }) => {
  try {
    const id = params.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: resource, error: resourceError } = await supabase.from("resources").select("*").eq("id", id).eq("status", "approved").eq("hidden", false).single();
    if (resourceError || !resource) {
      return new Response(JSON.stringify({ error: "Resource not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!resource.file_url) {
      return new Response(JSON.stringify({ error: "No file available for download" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const supabaseAdmin = getSupabaseAdmin();
    try {
      await supabaseAdmin.rpc("increment_resource_downloads", { resource_id: id });
    } catch (error) {
      console.error("Failed to increment download count:", error);
    }
    let fileResponse;
    if (resource.file_url.startsWith("http")) {
      fileResponse = await fetch(resource.file_url);
    } else {
      const { data: fileData } = await supabaseAdmin.storage.from("resources").download(resource.file_url);
      if (!fileData) {
        return new Response(JSON.stringify({ error: "File not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      const arrayBuffer = await fileData.arrayBuffer();
      fileResponse = new Response(arrayBuffer);
    }
    if (!fileResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch file" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const fileBlob = await fileResponse.blob();
    const fileName = resource.file_name || `resource-${id}`;
    return new Response(fileBlob, {
      status: 200,
      headers: {
        "Content-Type": fileBlob.type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600"
      }
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
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
