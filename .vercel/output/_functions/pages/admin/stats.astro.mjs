import { b as createAstro, c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, a as $$Wrapper, b as $$Text, u as useTranslations } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
import { c as checkAdminAuth } from '../../chunks/admin_DKwhe7Wu.mjs';
import { g as getSupabaseAdmin } from '../../chunks/admin_Ct61RJ0x.mjs';
import { c as countries } from '../../chunks/countries_B5aME9jS.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Stats;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  if (!checkAdminAuth(Astro2.cookies)) {
    return Astro2.redirect("/admin");
  }
  const supabaseAdmin = getSupabaseAdmin();
  const { data: analytics } = await supabaseAdmin.from("analytics").select("*").single();
  const { data: topResources } = await supabaseAdmin.from("resources").select("id, title, downloads_count, type, created_at").eq("status", "approved").eq("hidden", false).order("downloads_count", { ascending: false }).limit(50);
  const { data: topWallpapers } = await supabaseAdmin.from("wallpapers").select("id, title, download_count, category, created_at").eq("status", "published").eq("hidden", false).order("download_count", { ascending: false }).limit(50);
  const { data: topFeatures } = await supabaseAdmin.from("feature_requests").select("id, title, votes_count, admin_status, created_at").eq("status", "published").eq("hidden", false).order("votes_count", { ascending: false }).limit(50);
  const { data: locationStats } = await supabaseAdmin.from("location_declarations").select("country_code").order("created_at", { ascending: false });
  const locationAggregated = [];
  if (locationStats) {
    const stats = {};
    for (const declaration of locationStats) {
      const code = declaration.country_code.toUpperCase();
      stats[code] = (stats[code] || 0) + 1;
    }
    for (const [code, count] of Object.entries(stats)) {
      locationAggregated.push({
        code,
        name: countries[code]?.name || code,
        count
      });
    }
    locationAggregated.sort((a, b) => b.count - a.count);
  }
  const totalResourceDownloads = topResources?.reduce((sum, r) => sum + (r.downloads_count || 0), 0) || 0;
  const totalWallpaperDownloads = topWallpapers?.reduce((sum, w) => sum + (w.download_count || 0), 0) || 0;
  const totalGuideDownloads = (analytics?.pdf_v2_downloads || 0) + (analytics?.epub_v2_downloads || 0);
  const totalDownloads = totalResourceDownloads + totalWallpaperDownloads + totalGuideDownloads;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "data-astro-cid-h2yfglne": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section data-astro-cid-h2yfglne> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero", "data-astro-cid-h2yfglne": true }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center justify-between mb-8" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Statistics
` })} <div class="flex items-center gap-4" data-astro-cid-h2yfglne> <a href="/admin/resources" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Resources
` })} </a> <a href="/admin/features" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Features
` })} </a> <a href="/admin/wallpapers" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Wallpapers
` })} </a> <a href="/admin/logout" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Button", $$Button, { "variant": "muted", "size": "sm", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`${t("admin.logout")}` })} </a> </div> </div>  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-astro-cid-h2yfglne> <div class="bg-base-50 border border-base-200 rounded-lg p-6" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mb-1", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Total Downloads
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "displayLG", "class": "text-base-900 font-bold", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`${totalDownloads.toLocaleString()}` })} </div> <div class="bg-base-50 border border-base-200 rounded-lg p-6" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mb-1", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Guide Downloads
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "displayLG", "class": "text-base-900 font-bold", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`${totalGuideDownloads.toLocaleString()}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-base-500 mt-1", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
PDF: ${analytics?.pdf_v2_downloads || 0} | EPUB: ${analytics?.epub_v2_downloads || 0}` })} </div> <div class="bg-base-50 border border-base-200 rounded-lg p-6" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mb-1", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Resource Downloads
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "displayLG", "class": "text-base-900 font-bold", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`${totalResourceDownloads.toLocaleString()}` })} </div> <div class="bg-base-50 border border-base-200 rounded-lg p-6" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mb-1", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Wallpaper Downloads
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "displayLG", "class": "text-base-900 font-bold", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`${totalWallpaperDownloads.toLocaleString()}` })} </div> </div>  <div class="mb-8" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "text-base-900 font-semibold mb-4", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Top Resources by Downloads
` })} <div class="bg-base-50 border border-base-200 rounded-lg overflow-hidden" data-astro-cid-h2yfglne> <div class="overflow-x-auto" data-astro-cid-h2yfglne> <table class="w-full" id="resources-table" data-astro-cid-h2yfglne> <thead class="bg-base-100 border-b border-base-200" data-astro-cid-h2yfglne> <tr data-astro-cid-h2yfglne> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="title" data-astro-cid-h2yfglne>
Title <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="type" data-astro-cid-h2yfglne>
Type <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="downloads" data-astro-cid-h2yfglne>
Downloads <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="date" data-astro-cid-h2yfglne>
Created <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> </tr> </thead> <tbody class="divide-y divide-base-200" data-astro-cid-h2yfglne> ${topResources?.map((resource) => renderTemplate`<tr class="hover:bg-base-100" data-astro-cid-h2yfglne> <td class="px-4 py-3 text-sm text-base-900" data-astro-cid-h2yfglne> <a${addAttribute(`/resources/${resource.id}`, "href")} class="text-accent-600 hover:underline" target="_blank" data-astro-cid-h2yfglne> ${resource.title} </a> </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> ${resource.type} </td> <td class="px-4 py-3 text-sm text-base-900 font-medium" data-astro-cid-h2yfglne> ${resource.downloads_count.toLocaleString()} </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> ${new Date(resource.created_at).toLocaleDateString()} </td> </tr>`)} </tbody> </table> </div> </div> </div>  <div class="mb-8" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "text-base-900 font-semibold mb-4", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Top Wallpapers by Downloads
` })} <div class="bg-base-50 border border-base-200 rounded-lg overflow-hidden" data-astro-cid-h2yfglne> <div class="overflow-x-auto" data-astro-cid-h2yfglne> <table class="w-full" id="wallpapers-table" data-astro-cid-h2yfglne> <thead class="bg-base-100 border-b border-base-200" data-astro-cid-h2yfglne> <tr data-astro-cid-h2yfglne> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="title" data-astro-cid-h2yfglne>
Title <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="category" data-astro-cid-h2yfglne>
Category <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="downloads" data-astro-cid-h2yfglne>
Downloads <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="date" data-astro-cid-h2yfglne>
Created <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> </tr> </thead> <tbody class="divide-y divide-base-200" data-astro-cid-h2yfglne> ${topWallpapers?.map((wallpaper) => renderTemplate`<tr class="hover:bg-base-100" data-astro-cid-h2yfglne> <td class="px-4 py-3 text-sm text-base-900" data-astro-cid-h2yfglne> <a${addAttribute(`/wallpapers/${wallpaper.id}`, "href")} class="text-accent-600 hover:underline" target="_blank" data-astro-cid-h2yfglne> ${wallpaper.title || "Untitled"} </a> </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> ${wallpaper.category || "-"} </td> <td class="px-4 py-3 text-sm text-base-900 font-medium" data-astro-cid-h2yfglne> ${wallpaper.download_count.toLocaleString()} </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> ${new Date(wallpaper.created_at).toLocaleDateString()} </td> </tr>`)} </tbody> </table> </div> </div> </div>  <div class="mb-8" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "text-base-900 font-semibold mb-4", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Top Feature Requests by Votes
` })} <div class="bg-base-50 border border-base-200 rounded-lg overflow-hidden" data-astro-cid-h2yfglne> <div class="overflow-x-auto" data-astro-cid-h2yfglne> <table class="w-full" id="features-table" data-astro-cid-h2yfglne> <thead class="bg-base-100 border-b border-base-200" data-astro-cid-h2yfglne> <tr data-astro-cid-h2yfglne> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="title" data-astro-cid-h2yfglne>
Title <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="status" data-astro-cid-h2yfglne>
Status <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="votes" data-astro-cid-h2yfglne>
Votes <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="date" data-astro-cid-h2yfglne>
Created <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> </tr> </thead> <tbody class="divide-y divide-base-200" data-astro-cid-h2yfglne> ${topFeatures?.map((feature) => renderTemplate`<tr class="hover:bg-base-100" data-astro-cid-h2yfglne> <td class="px-4 py-3 text-sm text-base-900" data-astro-cid-h2yfglne> <a${addAttribute(`/board#feature-${feature.id}`, "href")} class="text-accent-600 hover:underline" target="_blank" data-astro-cid-h2yfglne> ${feature.title} </a> </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> <span${addAttribute(`px-2 py-1 rounded text-xs font-medium ${feature.admin_status === "completed" ? "bg-green-100 text-green-800" : feature.admin_status === "planned" ? "bg-blue-100 text-blue-800" : feature.admin_status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`, "class")} data-astro-cid-h2yfglne> ${feature.admin_status} </span> </td> <td class="px-4 py-3 text-sm text-base-900 font-medium" data-astro-cid-h2yfglne> ${feature.votes_count.toLocaleString()} </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> ${new Date(feature.created_at).toLocaleDateString()} </td> </tr>`)} </tbody> </table> </div> </div> </div>  <div class="mb-8" data-astro-cid-h2yfglne> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "text-base-900 font-semibold mb-4", "data-astro-cid-h2yfglne": true }, { "default": async ($$result4) => renderTemplate`
Users by Country
` })} <div class="bg-base-50 border border-base-200 rounded-lg overflow-hidden" data-astro-cid-h2yfglne> <div class="overflow-x-auto" data-astro-cid-h2yfglne> <table class="w-full" id="locations-table" data-astro-cid-h2yfglne> <thead class="bg-base-100 border-b border-base-200" data-astro-cid-h2yfglne> <tr data-astro-cid-h2yfglne> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="country" data-astro-cid-h2yfglne>
Country <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="users" data-astro-cid-h2yfglne>
Users <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> <th class="px-4 py-3 text-left text-sm font-semibold text-base-900 cursor-pointer hover:bg-base-200" data-sort="percentage" data-astro-cid-h2yfglne>
Percentage <span class="sort-indicator" data-astro-cid-h2yfglne>↕</span> </th> </tr> </thead> <tbody class="divide-y divide-base-200" data-astro-cid-h2yfglne> ${locationAggregated.map((location) => {
    const totalUsers = locationAggregated.reduce((sum, l) => sum + l.count, 0);
    const percentage = totalUsers > 0 ? (location.count / totalUsers * 100).toFixed(1) : "0";
    return renderTemplate`<tr class="hover:bg-base-100" data-astro-cid-h2yfglne> <td class="px-4 py-3 text-sm text-base-900" data-astro-cid-h2yfglne> ${location.name} </td> <td class="px-4 py-3 text-sm text-base-900 font-medium" data-astro-cid-h2yfglne> ${location.count.toLocaleString()} </td> <td class="px-4 py-3 text-sm text-base-600" data-astro-cid-h2yfglne> <div class="flex items-center gap-2" data-astro-cid-h2yfglne> <div class="flex-1 bg-base-200 rounded-full h-2" data-astro-cid-h2yfglne> <div class="bg-accent-500 h-2 rounded-full"${addAttribute(`width: ${percentage}%`, "style")} data-astro-cid-h2yfglne></div> </div> <span data-astro-cid-h2yfglne>${percentage}%</span> </div> </td> </tr>`;
  })} </tbody> </table> </div> </div> </div> ` })} </section> ` })} ${renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/stats.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/stats.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/stats.astro";
const $$url = "/admin/stats";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Stats,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
