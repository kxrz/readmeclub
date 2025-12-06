import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, c as getLangPrefix, u as useTranslations, b as $$Text } from './BaseLayout_CmF6HVGJ.mjs';
import { g as getGradientForId } from './gradients_DWIDfilt.mjs';

const $$Astro = createAstro("https://readme.club");
const $$ResourceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ResourceCard;
  const { resource } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const thumbnailUrl = resource.thumbnail_url || `/api/resources/${resource.id}/og-image.png`;
  const resourceUrl = langPrefix ? `${langPrefix}/resources/${resource.id}` : `/resources/${resource.id}`;
  const gradient = getGradientForId(resource.id);
  const gradientStyle = `background: linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%);`;
  const textColorStyle = `color: ${gradient.text};`;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(resourceUrl, "href")} class="group relative flex flex-col rounded-lg border border-base-200 bg-white p-4 hover:border-accent-300 hover:shadow-lg transition-all"> <div class="aspect-video w-full overflow-hidden rounded-md bg-base-100 mb-3"> ${resource.thumbnail_url ? renderTemplate`<img${addAttribute(thumbnailUrl, "src")}${addAttribute(resource.title, "alt")} class="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy">` : renderTemplate`<div class="h-full w-full flex items-center justify-center"${addAttribute(gradientStyle, "style")}> ${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textLG", "class": "font-semibold px-4 text-center", "style": textColorStyle }, { "default": ($$result2) => renderTemplate`${resource.title}` })} </div>`} </div> <div class="flex-1"> <div class="flex items-start justify-between gap-2 mb-2"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-semibold text-base-900 line-clamp-2 group-hover:text-accent-500" }, { "default": ($$result2) => renderTemplate`${resource.title}` })} <span class="shrink-0 text-xs uppercase text-base-500 bg-base-100 px-2 py-1 rounded"> ${t(`resources.type.${resource.type}`)} </span> </div> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 line-clamp-2 mb-3" }, { "default": ($$result2) => renderTemplate`${resource.description}` })} <div class="flex items-center justify-between mt-auto"> ${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "text-base-500" }, { "default": ($$result2) => renderTemplate`${t("resources.downloads", { count: resource.downloads_count })}` })} ${resource.tags && resource.tags.length > 0 && renderTemplate`<div class="flex gap-1 flex-wrap"> ${resource.tags.slice(0, 2).map((tag) => renderTemplate`<span class="text-xs text-base-500 bg-base-50 px-2 py-0.5 rounded"> ${tag} </span>`)} </div>`} </div> </div> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/resources/ResourceCard.astro", void 0);

export { $$ResourceCard as $ };
