import { b as createAstro, c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate, e as addAttribute, C as Fragment } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, a as $$Wrapper, b as $$Text, u as useTranslations } from './BaseLayout_CmF6HVGJ.mjs';
import { g as getGradientForId } from './gradients_DWIDfilt.mjs';

const $$Astro$1 = createAstro("https://readme.club");
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Hero;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  return renderTemplate`${maybeRenderHead()}<section class="relative overflow-hidden"> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero", "class": "relative" }, { "default": ($$result2) => renderTemplate` <div class="w-full max-w-[75%] mx-auto"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "display6XL", "class": "text-base-900 font-bold leading-none" }, { "default": ($$result3) => renderTemplate`${t("site.name")}<span class="text-base-500 text-[0.4em] font-normal">.club</span> ` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textLG", "class": "mt-6 text-base-700 text-balance" }, { "default": ($$result3) => renderTemplate`${t("site.tagline")}` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-2 text-base-600 text-balance" }, { "default": ($$result3) => renderTemplate`${t("site.description")}` })} <div class="mt-4 pt-4 border-t border-base-200"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-500 italic" }, { "default": ($$result3) => renderTemplate`${t("site.also_known_as")}` })} </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/landing/Hero.astro", void 0);

const $$Astro = createAstro("https://readme.club");
const $$MoreCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MoreCard;
  const { href, label, variant = "resource" } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const displayLabel = label || t("common.view") + " all";
  const isWallpaper = variant === "wallpaper";
  const gradient = getGradientForId(href);
  const gradientStyle = `background: linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%);`;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="group relative flex flex-col rounded-lg border border-base-200 bg-white overflow-hidden hover:border-accent-300 hover:shadow-lg transition-all"> ${isWallpaper ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <div class="aspect-[3/4] w-full overflow-hidden flex items-center justify-center opacity-60"${addAttribute(gradientStyle, "style")}> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus text-white group-hover:opacity-100 transition-opacity"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </div> <div class="p-4 flex-1 flex items-center justify-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "span", "variant": "textBase", "class": "font-semibold text-base-600 group-hover:text-accent-500 transition-colors text-center" }, { "default": ($$result3) => renderTemplate`${displayLabel}` })} </div> ` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <div class="aspect-video w-full overflow-hidden rounded-md mb-3 flex items-center justify-center opacity-60"${addAttribute(gradientStyle, "style")}> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus text-white group-hover:opacity-100 transition-opacity"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </div> <div class="flex-1 flex items-center justify-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "span", "variant": "textBase", "class": "font-semibold text-base-600 group-hover:text-accent-500 transition-colors" }, { "default": ($$result3) => renderTemplate`${displayLabel}` })} </div> ` })}`} </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/common/MoreCard.astro", void 0);

export { $$Hero as $, $$MoreCard as a };
