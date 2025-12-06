import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, C as Fragment, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, c as getLangPrefix, u as useTranslations, a as $$Wrapper, b as $$Text, d as getTranslatedCategory, e as getTranslatedTip } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Seo } from '../chunks/Seo_Dd6omgxK.mjs';
import { t as tipsData } from '../chunks/tips_BofIlNxs.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const siteUrl = Astro2.site || "https://readme.club";
  const tipsByCategory = {};
  const categoryOrder = [];
  tipsData.tips.forEach((tip) => {
    if (!tipsByCategory[tip.category]) {
      tipsByCategory[tip.category] = [];
      categoryOrder.push(tip.category);
    }
    tipsByCategory[tip.category].push(tip);
  });
  const categories = categoryOrder;
  const getCategoryAnchor = (category) => category.toLowerCase().replace(/\s+/g, "-");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`${t("tips.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result4) => renderTemplate`${t("tips.subtitle")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "mt-2 text-base-500" }, { "default": ($$result4) => renderTemplate`${tipsData.metadata.total_tips}${t("tips.total_tips")} • ${t("tips.last_updated")}: ${tipsData.metadata.last_updated}` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-4 gap-8"> <!-- Table of Contents --> <aside class="lg:col-span-1"> <div class="sticky top-24"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textSM", "class": "font-semibold text-base-900 mb-4 uppercase tracking-wide" }, { "default": ($$result4) => renderTemplate`${t("tips.table_of_contents") || "Table of Contents"}` })} <nav class="space-y-2"> ${categories.map((category) => renderTemplate`<a${addAttribute(`#${getCategoryAnchor(category)}`, "href")} class="block text-sm text-base-600 hover:text-accent-500 transition-colors py-1"> ${getTranslatedCategory(category, lang)} <span class="text-base-400 ml-2">
(${tipsByCategory[category].length})
</span> </a>`)} </nav> </div> </aside> <!-- Main Content --> <div class="lg:col-span-3"> <div class="space-y-12"> ${categories.map((category) => renderTemplate`<div${addAttribute(getCategoryAnchor(category), "id")} class="scroll-mt-24"> <div class="mb-6 pb-4 border-b border-base-200"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textLG", "class": "font-semibold text-base-900" }, { "default": ($$result4) => renderTemplate`${getTranslatedCategory(category, lang)}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-500 mt-1" }, { "default": ($$result4) => renderTemplate`${tipsByCategory[category].length}${t("tips.tips_count")}` })} </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"> ${tipsByCategory[category].map((tip) => renderTemplate`<div class="flex gap-3 items-start p-4 rounded-lg border border-base-200 hover:border-base-300 hover:bg-base-50 transition-all"> <div class="flex-shrink-0 mt-0.5"> <div class="w-6 h-6 rounded bg-accent-100 flex items-center justify-center"> ${renderComponent($$result3, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "font-semibold text-accent-700" }, { "default": ($$result4) => renderTemplate`${tip.id}` })} </div> </div> <div class="flex-1 min-w-0"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 leading-relaxed" }, { "default": ($$result4) => renderTemplate`${getTranslatedTip(tip.id, lang, tip.tip)}` })} </div> </div>`)} </div> </div>`)} </div> </div> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-12 border-t border-base-200 mt-16" }, { "default": ($$result3) => renderTemplate` <div class="text-center space-y-4"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-semibold text-base-900" }, { "default": ($$result4) => renderTemplate`${t("tips.contribute")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600" }, { "default": ($$result4) => renderTemplate`${t("tips.contribute_text")}` })} <a${addAttribute(`${langPrefix}/submit`, "href")} class="inline-flex items-center gap-2 justify-center rounded-lg py-3 px-6 text-sm outline-offset-2 transition bg-accent-500 text-white font-medium hover:bg-accent-600"> ${t("tips.submit_tip")} </a> </div> ` })} </section> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$Seo, { "title": `${t("tips.title")} - ${t("site.name")}`, "description": t("tips.subtitle"), "canonical": `${siteUrl}${langPrefix}/tips`, "lang": lang })} ` })}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tips/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tips/index.astro";
const $$url = "/tips";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
