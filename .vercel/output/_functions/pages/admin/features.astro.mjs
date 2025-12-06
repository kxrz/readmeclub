import { b as createAstro, c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, a as $$Wrapper, b as $$Text, u as useTranslations } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
import { c as checkAdminAuth } from '../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../chunks/admin_Ct61RJ0x.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  if (!checkAdminAuth(Astro2.cookies)) {
    return Astro2.redirect("/admin");
  }
  const supabaseAdmin = getSupabaseAdmin();
  const { data: features } = await supabaseAdmin.from("feature_requests").select("*").order("created_at", { ascending: false });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center justify-between"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("admin.features")}` })} <div class="flex items-center gap-4"> <a href="/admin/stats"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Stats
` })} </a> <a href="/admin/resources"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Resources
` })} </a> <a href="/admin/wallpapers"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`
Wallpapers
` })} </a> <a href="/admin/logout"> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm" }, { "default": async ($$result4) => renderTemplate`${t("admin.logout")}` })} </a> </div> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="space-y-4"> ${features && features.length > 0 ? features.map((feature) => renderTemplate`<div class="flex items-center justify-between p-4 border border-base-200 rounded-lg hover:bg-base-50"> <div class="flex-1"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-semibold text-base-900" }, { "default": async ($$result4) => renderTemplate`${feature.title}` })} <div class="flex items-center gap-4 mt-2"> <span${addAttribute(`text-xs px-2 py-1 rounded ${feature.admin_status === "pending" ? "bg-yellow-100 text-yellow-700" : feature.admin_status === "planned" ? "bg-blue-100 text-blue-700" : feature.admin_status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, "class")}> ${t(`board.status.${feature.admin_status}`)} </span> ${feature.hidden && renderTemplate`<span class="text-xs text-base-500">Hidden</span>`} <span class="text-xs text-base-500"> ${t("board.votes", { count: feature.votes_count })} </span> ${feature.reddit_username && renderTemplate`<span class="text-xs text-base-500">
@${feature.reddit_username} </span>`} </div> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mt-1 line-clamp-2" }, { "default": async ($$result4) => renderTemplate`${feature.description}` })} </div> <div class="flex items-center gap-2"> <select class="px-3 py-2 text-sm border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400"${addAttribute(`updateStatus('${feature.id}', this.value)`, "onchange")}${addAttribute(feature.admin_status, "value")}> <option value="pending">${t("board.status.pending")}</option> <option value="planned">${t("board.status.planned")}</option> <option value="completed">${t("board.status.completed")}</option> <option value="rejected">${t("board.status.rejected")}</option> </select> <button${addAttribute(`px-4 py-2 text-sm rounded-lg transition-colors ${feature.hidden ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-base-100 hover:bg-base-200"}`, "class")}${addAttribute(`toggleHidden('${feature.id}', ${!feature.hidden})`, "onclick")}> ${feature.hidden ? "Show" : "Hide"} </button> <a${addAttribute(`/board`, "href")} target="_blank" class="px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"> ${t("common.view")} </a> </div> </div>`) : renderTemplate`${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500 text-center py-12" }, { "default": async ($$result4) => renderTemplate`
No feature requests found
` })}`} </div> ` })} </section> ` })} ${renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/features.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/features.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/features.astro";
const $$url = "/admin/features";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Features,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
