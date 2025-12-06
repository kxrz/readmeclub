import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import 'clsx';
import { g as getLangFromUrl, c as getLangPrefix } from './BaseLayout_CmF6HVGJ.mjs';

const $$Astro = createAstro("https://readme.club");
const $$WallpaperThumbnail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WallpaperThumbnail;
  const { wallpaper } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const langPrefix = getLangPrefix(lang);
  const wallpaperUrl = langPrefix ? `${langPrefix}/wallpapers/${wallpaper.id}` : `/wallpapers/${wallpaper.id}`;
  const imageUrl = wallpaper.file_url || "/placeholder-wallpaper.jpg";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(wallpaperUrl, "href")} class="group relative flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden border border-base-200 bg-white hover:border-accent-300 hover:shadow-lg transition-all"${addAttribute(wallpaper.title || "Wallpaper", "title")}> <img${addAttribute(imageUrl, "src")}${addAttribute(wallpaper.title || "Wallpaper", "alt")} class="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy"> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/wallpapers/WallpaperThumbnail.astro", void 0);

export { $$WallpaperThumbnail as $ };
