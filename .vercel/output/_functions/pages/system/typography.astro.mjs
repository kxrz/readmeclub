import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
export { renderers } from '../../renderers.mjs';

const $$Typography$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl" }, { "default": ($$result3) => renderTemplate`Typography
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Inter
` })} ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "standard" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col divide-y divide-base-200 text-base-900 font-medium"> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS" }, { "default": ($$result3) => renderTemplate` Text XS ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textSM" }, { "default": ($$result3) => renderTemplate` Text SM ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase" }, { "default": ($$result3) => renderTemplate` Text MD ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase" }, { "default": ($$result3) => renderTemplate` Text Base ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textLG" }, { "default": ($$result3) => renderTemplate` Text LG ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXL" }, { "default": ($$result3) => renderTemplate` Text XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "displayXS" }, { "default": ($$result3) => renderTemplate` Display XS ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "displaySM" }, { "default": ($$result3) => renderTemplate` Display SM ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "displayMD" }, { "default": ($$result3) => renderTemplate` Display MD ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "displayLG" }, { "default": ($$result3) => renderTemplate` Display LG ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "displayXL" }, { "default": ($$result3) => renderTemplate` Display XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "display2XL" }, { "default": ($$result3) => renderTemplate` Display 2XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "display3XL" }, { "default": ($$result3) => renderTemplate` Display 3XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "display4XL" }, { "default": ($$result3) => renderTemplate` Display 4XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "display5XL" }, { "default": ($$result3) => renderTemplate` Display 5XL ` })} </div> <div class="py-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "display6XL" }, { "default": ($$result3) => renderTemplate` Display 6XL ` })} </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/system/Typography.astro", void 0);

const $$Typography = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TypographyComponent", $$Typography$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/typography.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/typography.astro";
const $$url = "/system/typography";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Typography,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
