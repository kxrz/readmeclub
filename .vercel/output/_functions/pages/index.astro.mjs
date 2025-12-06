import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, C as Fragment, m as maybeRenderHead } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, u as useTranslations, a as $$Wrapper, b as $$Text, c as getLangPrefix } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Hero, a as $$MoreCard } from '../chunks/MoreCard_DDaJD53w.mjs';
import { $ as $$ResourceCard } from '../chunks/ResourceCard_oRAN5S0u.mjs';
import { $ as $$WallpaperCard } from '../chunks/WallpaperCard_D2yH04ig.mjs';
import { $ as $$SmallResourceCard, a as $$SmallMoreCard } from '../chunks/SmallMoreCard_CK4i7p3I.mjs';
import { $ as $$Seo } from '../chunks/Seo_Dd6omgxK.mjs';
import { s as supabase } from '../chunks/client_DiYgajIf.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const { data: featuredResources } = await supabase.from("resources").select("*").eq("status", "approved").eq("hidden", false).order("downloads_count", { ascending: false }).limit(8);
  const { data: starredResources } = await supabase.from("resources").select("*").eq("status", "approved").eq("hidden", false).eq("starred", true).order("created_at", { ascending: false }).limit(6);
  const { data: latestWallpapers } = await supabase.from("wallpapers").select("*").eq("status", "published").eq("hidden", false).order("created_at", { ascending: false }).limit(4);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, {})} ${featuredResources && featuredResources.length > 0 && renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-col gap-4 lg:flex-row lg:justify-between border-t border-base-200 pt-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase text-base-600" }, { "default": async ($$result4) => renderTemplate`${t("resources.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": `${lang === "en" ? "" : `/${lang}`}/resources`, "aria-label": t("nav.resources"), "class": "text-base-600 uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": async ($$result4) => renderTemplate`${t("common.view")} all
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M5 12l14 0"></path> <path d="M15 16l4 -4"></path> <path d="M15 8l4 4"></path> </svg> ` })} </div> <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mt-8"> ${featuredResources.map((resource) => renderTemplate`${renderComponent($$result3, "ResourceCard", $$ResourceCard, { "resource": resource })}`)} ${renderComponent($$result3, "MoreCard", $$MoreCard, { "href": `${langPrefix}/resources`, "label": t("common.view") + " all" })} </div> ` })} </section>`}${starredResources && starredResources.length > 0 && renderTemplate`<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="border-t border-base-200 pt-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase text-base-600" }, { "default": async ($$result4) => renderTemplate`${t("resources.starred_resources")}` })} </div> <div class="grid grid-cols-1 gap-2 mt-6"> ${starredResources.map((resource) => renderTemplate`${renderComponent($$result3, "SmallResourceCard", $$SmallResourceCard, { "resource": resource })}`)} ${renderComponent($$result3, "SmallMoreCard", $$SmallMoreCard, { "href": `${langPrefix}/resources`, "label": t("common.view") + " all" })} </div> ` })} </section>`}${latestWallpapers && latestWallpapers.length > 0 && renderTemplate`<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-col gap-4 lg:flex-row lg:justify-between border-t border-base-200 pt-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase text-base-600" }, { "default": async ($$result4) => renderTemplate`${t("wallpapers.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": `${lang === "en" ? "" : `/${lang}`}/wallpapers`, "aria-label": t("nav.wallpapers"), "class": "text-base-600 uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": async ($$result4) => renderTemplate`${t("common.view")} all
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M5 12l14 0"></path> <path d="M15 16l4 -4"></path> <path d="M15 8l4 4"></path> </svg> ` })} </div> <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 mt-8"> ${latestWallpapers.map((wallpaper) => renderTemplate`${renderComponent($$result3, "WallpaperCard", $$WallpaperCard, { "wallpaper": wallpaper })}`)} ${renderComponent($$result3, "MoreCard", $$MoreCard, { "href": `${langPrefix}/wallpapers`, "label": t("common.view") + " all", "variant": "wallpaper" })} </div> ` })} </section>`}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="border-t border-base-200 pt-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase text-base-600" }, { "default": async ($$result4) => renderTemplate`${t("disclaimer.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "mt-4 text-base-600" }, { "default": async ($$result4) => renderTemplate`${t("disclaimer.content")}` })} </div> ` })} </section> `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$Seo, { "title": `${t("site.name")} - ${t("site.tagline")}`, "description": t("site.description"), "lang": lang })} ` })}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
