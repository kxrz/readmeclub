import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, C as Fragment, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, u as useTranslations, $ as $$BaseLayout, c as getLangPrefix, a as $$Wrapper, b as $$Text } from '../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$ResourceCard } from '../chunks/ResourceCard_CcA03vFK.mjs';
import { $ as $$Seo } from '../chunks/Seo_Dd6omgxK.mjs';
import { $ as $$Link } from '../chunks/Link_Ins73ZxP.mjs';
import { s as supabase } from '../chunks/client_DiYgajIf.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const siteUrl = Astro2.site || "https://readme.club";
  const url = Astro2.url;
  const type = url.searchParams.get("type") || null;
  const limit = 50;
  const offset = 0;
  let query = supabase.from("resources").select("*").eq("status", "approved").eq("hidden", false).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (type) {
    query = query.eq("type", type);
  }
  const { data: resources } = await query;
  const resourceTypes = [
    { value: "tool", label: t("resources.type.tool") },
    { value: "language_file", label: t("resources.type.language_file") },
    { value: "plugin", label: t("resources.type.plugin") },
    { value: "documentation", label: t("resources.type.documentation") },
    { value: "link", label: t("resources.type.link") },
    { value: "other", label: t("resources.type.other") }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("resources.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`${t("resources.subtitle")}` })} <div class="mt-4"> <a${addAttribute(`${langPrefix}/submit`, "href")} class="inline-flex items-center gap-1.5 text-sm text-base-500 hover:text-accent-500 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5v14"></path> <path d="M5 12h14"></path> </svg> ${t("resources.add_new")} </a> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": async ($$result3) => renderTemplate` <div class="scrollable-content relative flex snap-x snap-proximity gap-2 py-2 px-2 overflow-x-scroll scrollbar-hide"> ${renderComponent($$result3, "Link", $$Link, { "size": "xs", "variant": "ghost", "title": t("common.filter") + ": All", "aria-label": t("common.filter") + ": All", "href": `${lang === "en" ? "" : `/${lang}`}/resources`, "class": !type ? "bg-base-900 text-white hover:bg-base-800 ring-base-900 font-semibold" : "text-base-900 bg-white ring-2 ring-base-400 hover:ring-accent-400 hover:bg-accent-50 font-medium" }, { "default": async ($$result4) => renderTemplate`${t("common.filter")}: All
` })} ${resourceTypes.map((rt) => renderTemplate`${renderComponent($$result3, "Link", $$Link, { "size": "xs", "variant": "ghost", "title": rt.label, "aria-label": rt.label, "href": `${lang === "en" ? "" : `/${lang}`}/resources?type=${rt.value}`, "class": type === rt.value ? "bg-base-900 text-white hover:bg-base-800 ring-base-900 font-semibold" : "text-base-900 bg-white ring-2 ring-base-400 hover:ring-accent-400 hover:bg-accent-50 font-medium" }, { "default": async ($$result4) => renderTemplate`${rt.label}` })}`)} </div>  ${resources && resources.length > 0 ? renderTemplate`<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-2"> ${resources.map((resource) => renderTemplate`${renderComponent($$result3, "ResourceCard", $$ResourceCard, { "resource": resource })}`)} </div>` : renderTemplate`<div class="text-center py-12"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500" }, { "default": async ($$result4) => renderTemplate`${t("resources.no_results")}` })} </div>`}` })} </section> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$Seo, { "title": `${t("resources.title")} - ${t("site.name")}`, "description": t("resources.subtitle"), "canonical": `${siteUrl}${langPrefix}/resources`, "lang": lang })} ` })}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/resources/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/resources/index.astro";
const $$url = "/resources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
