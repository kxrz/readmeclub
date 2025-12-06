import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, c as getLangPrefix, b as $$Text, u as useTranslations } from './BaseLayout_CmF6HVGJ.mjs';

const $$Astro = createAstro("https://readme.club");
const $$WallpaperCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WallpaperCard;
  const { wallpaper } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const wallpaperUrl = langPrefix ? `${langPrefix}/wallpapers/${wallpaper.id}` : `/wallpapers/${wallpaper.id}`;
  const imageUrl = wallpaper.file_url || "/placeholder-wallpaper.jpg";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(wallpaperUrl, "href")} class="group relative flex flex-col rounded-lg border border-base-200 bg-white overflow-hidden hover:border-accent-300 hover:shadow-lg transition-all"> <div class="aspect-[3/4] w-full overflow-hidden bg-base-100"> <img${addAttribute(imageUrl, "src")}${addAttribute(wallpaper.title || "Wallpaper", "alt")} class="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy"> </div> <div class="p-4 flex-1"> <div class="flex items-start justify-between gap-2 mb-2"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-semibold text-base-900 line-clamp-2 group-hover:text-accent-500" }, { "default": ($$result2) => renderTemplate`${wallpaper.title || "Untitled Wallpaper"}` })} ${wallpaper.category && renderTemplate`<span class="shrink-0 text-xs uppercase text-base-500 bg-base-100 px-2 py-1 rounded"> ${wallpaper.category} </span>`} </div> <div class="flex items-center justify-between mt-auto"> ${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "text-base-500" }, { "default": ($$result2) => renderTemplate`${t("wallpapers.downloads", { count: wallpaper.download_count })}` })} ${wallpaper.author_name && renderTemplate`${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "text-base-500" }, { "default": ($$result2) => renderTemplate`${wallpaper.author_name}` })}`} </div> </div> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/wallpapers/WallpaperCard.astro", void 0);

export { $$WallpaperCard as $ };
