import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, C as Fragment, m as maybeRenderHead } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, c as getLangPrefix, u as useTranslations, a as $$Wrapper, b as $$Text } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$SubmitResource } from '../chunks/SubmitResource_CFaByj47.mjs';
import { $ as $$Seo } from '../chunks/Seo_Dd6omgxK.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Submit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Submit;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const langPrefix = getLangPrefix(lang);
  const siteUrl = Astro2.site || "https://readme.club";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`${t("resources.submit_new")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result4) => renderTemplate`
Share your resource with the community
` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "SubmitResource", $$SubmitResource, {})} ` })} </section> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Seo", $$Seo, { "title": `${t("resources.submit_new")} - ${t("site.name")}`, "description": t("site.description"), "canonical": `${siteUrl}${langPrefix}/submit`, "lang": lang })} ` })}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/submit.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/submit.astro";
const $$url = "/submit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Submit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
