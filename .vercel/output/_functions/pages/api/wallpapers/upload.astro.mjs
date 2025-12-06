import { g as getSupabaseAdmin } from '../../../chunks/admin_Ct61RJ0x.mjs';
import { getIPHash, checkSubmissionLimit, incrementSubmissionCount } from '../../../chunks/rate-limit_BVj0SoS1.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ error: "File too large (max 10MB)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml"
    ];
    const fileType = file.type;
    const fileLowerCaseName = file.name.toLowerCase();
    const fileExtension = fileLowerCaseName.substring(fileLowerCaseName.lastIndexOf(".") + 1);
    const allowedExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    const isValidType = fileType && allowedTypes.includes(fileType);
    const isValidExtension = allowedExtensions.includes(fileExtension);
    if (!isValidType && !isValidExtension) {
      return new Response(JSON.stringify({
        error: `File type not allowed. Allowed formats: ${allowedExtensions.join(", ")}`
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let width = 1920;
    let height = 1080;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const view = new DataView(arrayBuffer);
      if (fileExtension === "png" && arrayBuffer.byteLength >= 24) {
        width = view.getUint32(16, false);
        height = view.getUint32(20, false);
      } else if (["jpg", "jpeg"].includes(fileExtension) && arrayBuffer.byteLength >= 20) {
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < uint8Array.length - 8; i++) {
          if (uint8Array[i] === 255 && uint8Array[i + 1] === 192) {
            height = view.getUint16(i + 5, false);
            width = view.getUint16(i + 7, false);
            break;
          }
        }
      }
      if (width === 0 || height === 0 || width > 1e4 || height > 1e4) {
        width = 1920;
        height = 1080;
      }
    } catch (error) {
      console.error("Error reading image dimensions:", error);
      width = 1920;
      height = 1080;
    }
    const supabaseAdmin = getSupabaseAdmin();
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("wallpapers").upload(fileName, file, {
      contentType: file.type,
      upsert: false
    });
    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { data: { publicUrl } } = supabaseAdmin.storage.from("wallpapers").getPublicUrl(uploadData.path);
    await incrementSubmissionCount(ipHash);
    return new Response(JSON.stringify({
      url: publicUrl,
      path: uploadData.path,
      fileName: file.name,
      fileSize: file.size,
      width,
      height
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
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
