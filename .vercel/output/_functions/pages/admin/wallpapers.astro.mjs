import { b as createAstro, c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, u as useTranslations, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
import { c as checkAdminAuth } from '../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../chunks/admin_Ct61RJ0x.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Wallpapers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Wallpapers;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  if (!checkAdminAuth(Astro2.cookies)) {
    return Astro2.redirect("/admin");
  }
  const supabaseAdmin = getSupabaseAdmin();
  const { data: wallpapers } = await supabaseAdmin.from("wallpapers").select("*").order("created_at", { ascending: false });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center justify-between"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("admin.wallpapers")}` })} <div class="flex items-center gap-4"> <a href="/admin/stats"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Stats
` })} </a> <a href="/admin/resources"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Resources
` })} </a> <a href="/admin/features"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Features
` })} </a> <a href="/admin/logout"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`${t("admin.logout")}` })} </a> </div> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="space-y-4"> ${wallpapers && wallpapers.length > 0 ? wallpapers.map((wallpaper) => renderTemplate`<div class="flex items-center justify-between p-4 border border-base-200 rounded-lg hover:bg-base-50"> <div class="flex-1 flex items-center gap-4"> ${wallpaper.file_url && renderTemplate`<img${addAttribute(wallpaper.file_url, "src")}${addAttribute(wallpaper.title || "Wallpaper", "alt")} class="w-20 h-20 object-cover rounded-lg border border-base-200">`} <div class="flex-1"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-semibold text-base-900" }, { "default": async ($$result4) => renderTemplate`${wallpaper.title || "Untitled"}` })} <div class="flex items-center gap-4 mt-2"> <span${addAttribute(`text-xs px-2 py-1 rounded ${wallpaper.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`, "class")}> ${wallpaper.status} </span> ${wallpaper.category && renderTemplate`<span class="text-xs text-base-500"> ${t(`wallpapers.category.${wallpaper.category}`)} </span>`} ${wallpaper.hidden && renderTemplate`<span class="text-xs text-base-500">Hidden</span>`} <span class="text-xs text-base-500"> ${t("wallpapers.downloads", { count: wallpaper.download_count })} </span> ${wallpaper.author_name && renderTemplate`<span class="text-xs text-base-500"> ${wallpaper.author_name} </span>`} </div> ${wallpaper.width && wallpaper.height && renderTemplate`<span class="text-xs text-base-500"> ${wallpaper.width} × ${wallpaper.height} </span>`} </div> </div> <div class="flex items-center gap-2"> <select class="px-3 py-2 text-sm border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400"${addAttribute(`updateStatus('${wallpaper.id}', this.value)`, "onchange")}> <option value="draft"${addAttribute(wallpaper.status === "draft", "selected")}>Draft</option> <option value="published"${addAttribute(wallpaper.status === "published" || !wallpaper.status, "selected")}>Published</option> </select> <button${addAttribute(`px-4 py-2 text-sm rounded-lg transition-colors ${wallpaper.hidden ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-base-100 hover:bg-base-200"}`, "class")}${addAttribute(`toggleHidden('${wallpaper.id}', ${!wallpaper.hidden})`, "onclick")}> ${wallpaper.hidden ? "Show" : "Hide"} </button> <button class="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"${addAttribute(`openEditModal('${wallpaper.id}')`, "onclick")}> ${t("common.edit")} </button> <a${addAttribute(`/wallpapers/${wallpaper.id}`, "href")} target="_blank" class="px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"> ${t("common.view")} </a> </div> </div>`) : renderTemplate`${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500 text-center py-12" }, { "default": async ($$result4) => renderTemplate`
No wallpapers found
` })}`} </div> ` })} </section>  <div id="editModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4"> <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"> <div class="p-6"> <div class="flex items-center justify-between mb-6"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900" }, { "default": async ($$result3) => renderTemplate`
Edit Wallpaper
` })} <button onclick="closeEditModal()" class="text-base-500 hover:text-base-900 transition-colors"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <form id="editForm" onsubmit="handleEditSubmit(event)"> <input type="hidden" id="editWallpaperId"> <div class="space-y-4"> <!-- Status --> <div> <label for="editStatus" class="block text-sm font-medium text-base-900 mb-2">
Status
</label> <select id="editStatus" name="status" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400" required> <option value="draft">Draft</option> <option value="published">Published</option> </select> </div> <!-- Title --> <div> <label for="editTitle" class="block text-sm font-medium text-base-900 mb-2">
Title (${t("common.optional")})
</label> <input type="text" id="editTitle" name="title" maxlength="60" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400" placeholder="Wallpaper title"> </div> <!-- Category --> <div> <label for="editCategory" class="block text-sm font-medium text-base-900 mb-2">
Category (${t("common.optional")})
</label> <select id="editCategory" name="category" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400"> <option value="">None</option> <option value="minimalist">${t("wallpapers.category.minimalist")}</option> <option value="dark">${t("wallpapers.category.dark")}</option> <option value="light">${t("wallpapers.category.light")}</option> <option value="pop_culture">${t("wallpapers.category.pop_culture")}</option> <option value="custom">${t("wallpapers.category.custom")}</option> <option value="other">${t("wallpapers.category.other")}</option> </select> </div> <!-- Author Name --> <div> <label for="editAuthorName" class="block text-sm font-medium text-base-900 mb-2">
Author Name (${t("common.optional")})
</label> <input type="text" id="editAuthorName" name="author_name" maxlength="50" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400" placeholder="Author name"> </div> <!-- Reddit Username --> <div> <label for="editRedditUsername" class="block text-sm font-medium text-base-900 mb-2">
Reddit Username (${t("common.optional")})
</label> <input type="text" id="editRedditUsername" name="reddit_username" maxlength="30" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400" placeholder="u/username"> </div> <!-- Instagram Username --> <div> <label for="editInstagramUsername" class="block text-sm font-medium text-base-900 mb-2">
Instagram Username (${t("common.optional")})
</label> <input type="text" id="editInstagramUsername" name="instagram_username" maxlength="30" class="w-full px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400" placeholder="@username"> </div> </div> <div class="flex items-center justify-end gap-4 mt-6"> <button type="button" onclick="closeEditModal()" class="px-4 py-2 text-sm bg-base-100 hover:bg-base-200 rounded-lg transition-colors"> ${t("common.cancel")} </button> <button type="submit" class="px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors">
Save Changes
</button> </div> </form> </div> </div> </div> ` })} ${renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/wallpapers.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/wallpapers.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/wallpapers.astro";
const $$url = "/admin/wallpapers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Wallpapers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
