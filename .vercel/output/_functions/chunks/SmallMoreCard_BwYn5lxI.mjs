import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, c as getLangPrefix, b as $$Text, u as useTranslations } from './BaseLayout_CO6ejgXa.mjs';

const $$Astro$1 = createAstro("https://readme.club");
const $$SmallResourceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SmallResourceCard;
  const { resource } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const langPrefix = getLangPrefix(lang);
  const resourceUrl = langPrefix ? `${langPrefix}/resources/${resource.id}` : `/resources/${resource.id}`;
  const thumbnailUrl = resource.thumbnail_url || `/api/resources/${resource.id}/og-image.png`;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(resourceUrl, "href")}${addAttribute(resource.title, "title")} class="relative flex items-center gap-x-3 rounded-md bg-base-50 p-4 focus-outline-none"> <div class="flex-shrink-0 p-1 size-16 bg-white rounded-full items-center flex justify-center"> ${resource.thumbnail_url ? renderTemplate`<img${addAttribute(thumbnailUrl, "src")}${addAttribute(resource.title, "alt")} class="object-cover size-10 rounded-full" loading="lazy">` : renderTemplate`<div class="size-10 rounded-full bg-base-200 flex items-center justify-center"> ${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "font-semibold text-base-600" }, { "default": ($$result2) => renderTemplate`${resource.title.substring(0, 2).toUpperCase()}` })} </div>`} </div> <div class="min-w-0 flex-1"> <span class="absolute inset-0" aria-hidden="true"></span> <div> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textSM", "class": "font-medium text-base-900" }, { "default": ($$result2) => renderTemplate`${resource.title}` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-base-600 mt-1 line-clamp-1" }, { "default": ($$result2) => renderTemplate`${resource.description.length > 35 ? resource.description.substring(0, 35).trim() + "..." : resource.description}` })} </div> </div> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/resources/SmallResourceCard.astro", void 0);

const $$Astro = createAstro("https://readme.club");
const $$SmallMoreCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SmallMoreCard;
  const { href, label } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const displayLabel = label || t("common.view") + " all";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(displayLabel, "title")} class="relative flex items-center gap-x-3 rounded-md bg-base-50 p-4 focus-outline-none"> <div class="flex-shrink-0 p-1 size-16 bg-white rounded-full items-center flex justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-10 text-base-400"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </div> <div class="min-w-0 flex-1"> <span class="absolute inset-0" aria-hidden="true"></span> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textSM", "class": "font-medium text-base-600" }, { "default": ($$result2) => renderTemplate`${displayLabel}` })} </div> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/resources/SmallMoreCard.astro", void 0);

export { $$SmallResourceCard as $, $$SmallMoreCard as a };
