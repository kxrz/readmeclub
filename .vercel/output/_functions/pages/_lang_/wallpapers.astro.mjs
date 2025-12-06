import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { u as useTranslations, $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$WallpaperCard } from '../../chunks/WallpaperCard_D2yH04ig.mjs';
import { s as supabase } from '../../chunks/client_DiYgajIf.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = Astro2.params.lang || "en";
  const t = useTranslations(lang);
  const url = Astro2.url;
  const category = url.searchParams.get("category") || null;
  const limit = 50;
  const offset = 0;
  let query = supabase.from("wallpapers").select("*").eq("status", "published").eq("hidden", false).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (category) {
    query = query.eq("category", category);
  }
  const { data: wallpapers } = await query;
  const categories = [
    { value: "minimalist", label: t("wallpapers.category.minimalist") },
    { value: "dark", label: t("wallpapers.category.dark") },
    { value: "light", label: t("wallpapers.category.light") },
    { value: "pop_culture", label: t("wallpapers.category.pop_culture") },
    { value: "custom", label: t("wallpapers.category.custom") },
    { value: "other", label: t("wallpapers.category.other") }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("wallpapers.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`${t("wallpapers.subtitle")}` })} <div class="mt-4"> <a${addAttribute(`/${lang}/submit`, "href")} class="inline-flex items-center gap-1.5 text-sm text-base-500 hover:text-accent-500 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5v14"></path> <path d="M5 12h14"></path> </svg> ${t("wallpapers.add_new")} </a> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": async ($$result3) => renderTemplate`  <div class="flex flex-wrap gap-2 mb-6"> <a${addAttribute(`/${lang}/wallpapers`, "href")}${addAttribute(`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? "bg-accent-500 text-white" : "bg-base-100 text-base-700 hover:bg-base-200"}`, "class")}> ${t("common.filter")}: All
</a> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/${lang}/wallpapers?category=${cat.value}`, "href")}${addAttribute(`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value ? "bg-accent-500 text-white" : "bg-base-100 text-base-700 hover:bg-base-200"}`, "class")}> ${cat.label} </a>`)} </div>  ${wallpapers && wallpapers.length > 0 ? renderTemplate`<div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"> ${wallpapers.map((wallpaper) => renderTemplate`${renderComponent($$result3, "WallpaperCard", $$WallpaperCard, { "wallpaper": wallpaper })}`)} </div>` : renderTemplate`<div class="text-center py-12"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500" }, { "default": async ($$result4) => renderTemplate`${t("wallpapers.no_results")}` })} </div>`}` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/wallpapers/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/wallpapers/index.astro";
const $$url = "/[lang]/wallpapers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
