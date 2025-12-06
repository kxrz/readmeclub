import { b as createAstro, c as createComponent, a as renderTemplate, x as unescapeHTML, d as renderScript, r as renderComponent, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, u as useTranslations, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$Seo } from '../../chunks/Seo_Dd6omgxK.mjs';
import { s as supabase } from '../../chunks/client_DiYgajIf.mjs';
import { c as countries } from '../../chunks/countries_B5aME9jS.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://readme.club");
const $$Location = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Location;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const { data: locationStats } = await supabase.from("location_declarations").select("country_code").order("created_at", { ascending: false });
  const stats = {};
  let total = 0;
  if (locationStats) {
    for (const declaration of locationStats) {
      const code = declaration.country_code.toUpperCase();
      stats[code] = (stats[code] || 0) + 1;
      total++;
    }
  }
  const markers = Object.entries(stats).map(([code, count]) => ({
    code,
    count,
    name: countries[code]?.name || code,
    coords: countries[code]?.coords || null
  })).filter((m) => m.coords !== null);
  return renderTemplate(_a || (_a = __template(["", ' <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"> ', ' <script id="markers-data" type="application/json">', "<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Seo", $$Seo, { "title": t("location.title"), "description": t("location.subtitle"), "canonical": `${Astro2.site}/${lang}/location`, "lang": lang })} ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("location.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`${t("location.subtitle")}` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="space-y-6"> <!-- Stats Summary --> <div class="bg-base-50 rounded-lg p-6 border border-base-200"> <div class="flex items-center justify-between flex-wrap gap-4"> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-2" }, { "default": async ($$result4) => renderTemplate`${`${total} ${total === 1 ? "user" : "users"}`}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600" }, { "default": async ($$result4) => renderTemplate`${`${Object.keys(stats).length} ${Object.keys(stats).length === 1 ? "country" : "countries"}`}` })} </div> <!-- Declare Location Form --> <div class="flex items-center gap-4"> <select id="countrySelect" class="px-4 py-2 border border-base-200 rounded-lg focus:ring-2 focus:ring-accent-400 focus:border-accent-400 min-w-[200px]"> <option value="">${t("location.select_country")}</option> ${Object.entries(countries).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, country]) => renderTemplate`<option${addAttribute(code, "value")}>${country.name} (${code})</option>`)} </select> <button id="declareBtn" class="px-6 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"> ${t("location.submit")} </button> </div> </div> </div> <!-- Map Container --> <div id="map" class="w-full h-[600px] rounded-lg border-2 border-base-200"></div> ${markers.length === 0 ? renderTemplate`<div class="text-center py-12"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500" }, { "default": async ($$result4) => renderTemplate`${t("location.no_data")}` })} </div>` : renderTemplate`<!-- Statistics Table -->
          <div class="bg-base-50 rounded-lg border border-base-200 overflow-hidden"> <div class="p-6 border-b border-base-200"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900" }, { "default": async ($$result4) => renderTemplate`${t("location.stats_table")}` })} </div> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-base-100"> <tr> <th class="px-6 py-3 text-left text-sm font-semibold text-base-900 border-b border-base-200"> ${t("location.country")} </th> <th class="px-6 py-3 text-right text-sm font-semibold text-base-900 border-b border-base-200"> ${t("location.users")} </th> <th class="px-6 py-3 text-right text-sm font-semibold text-base-900 border-b border-base-200 w-32"> ${t("location.percentage")} </th> </tr> </thead> <tbody class="divide-y divide-base-200"> ${Object.entries(stats).sort((a, b) => b[1] - a[1]).map(([code, count]) => {
    const country = countries[code];
    const percentage = total > 0 ? (count / total * 100).toFixed(1) : "0.0";
    return renderTemplate`<tr class="hover:bg-base-50 transition-colors"> <td class="px-6 py-4 text-sm text-base-900"> <div class="flex items-center gap-3"> <span class="font-medium text-base-700">${code}</span> ${country && renderTemplate`<span class="text-base-600">${country.name}</span>`} </div> </td> <td class="px-6 py-4 text-sm text-base-900 text-right font-medium"> ${count} </td> <td class="px-6 py-4 text-right"> <div class="flex items-center justify-end gap-2"> <div class="flex-1 max-w-[100px] h-2 bg-base-200 rounded-full overflow-hidden"> <div class="h-full rounded-full transition-all"${addAttribute(`width: ${percentage}%; background: linear-gradient(90deg, #283618 0%, #606c38 50%, #dda15e 100%);`, "style")}></div> </div> <span class="text-sm text-base-600 w-12 text-right">${percentage}%</span> </div> </td> </tr>`;
  })} </tbody> </table> </div> </div>`} </div> ` })} </section> ` }), renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/location.astro?astro&type=script&index=0&lang.ts"), unescapeHTML(JSON.stringify(markers)));
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/location.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/location.astro";
const $$url = "/[lang]/location";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Location,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
