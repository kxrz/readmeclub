import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$Buttons$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl" }, { "default": ($$result3) => renderTemplate`Buttons
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
All variants
` })} ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "standard" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col divide-y divide-base-200 text-base-900 font-medium"> <div class="py-4 flex flex-wrap items-center gap-4"> ${renderComponent($$result2, "Button", $$Button, { "size": "xs", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default XS` })} ${renderComponent($$result2, "Button", $$Button, { "size": "sm", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default SM` })} ${renderComponent($$result2, "Button", $$Button, { "size": "base", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default Base` })} ${renderComponent($$result2, "Button", $$Button, { "size": "md", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default MD` })} ${renderComponent($$result2, "Button", $$Button, { "size": "lg", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default LG` })} ${renderComponent($$result2, "Button", $$Button, { "size": "xl", "variant": "default" }, { "default": ($$result3) => renderTemplate`Default XL` })} </div> <div class="py-4 flex flex-wrap items-center gap-4"> ${renderComponent($$result2, "Button", $$Button, { "size": "xs", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent XS` })} ${renderComponent($$result2, "Button", $$Button, { "size": "sm", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent SM` })} ${renderComponent($$result2, "Button", $$Button, { "size": "base", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent Base` })} ${renderComponent($$result2, "Button", $$Button, { "size": "md", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent MD` })} ${renderComponent($$result2, "Button", $$Button, { "size": "lg", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent LG` })} ${renderComponent($$result2, "Button", $$Button, { "size": "xl", "variant": "accent" }, { "default": ($$result3) => renderTemplate`Accent XL` })} </div> <div class="py-4 flex flex-wrap items-center gap-4"> ${renderComponent($$result2, "Button", $$Button, { "size": "xs", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted XS` })} ${renderComponent($$result2, "Button", $$Button, { "size": "sm", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted SM` })} ${renderComponent($$result2, "Button", $$Button, { "size": "base", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted Base` })} ${renderComponent($$result2, "Button", $$Button, { "size": "md", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted MD` })} ${renderComponent($$result2, "Button", $$Button, { "size": "lg", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted LG` })} ${renderComponent($$result2, "Button", $$Button, { "size": "xl", "variant": "muted" }, { "default": ($$result3) => renderTemplate`Muted XL` })} </div> <div class="py-4 flex flex-col  gap-12"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Alternative
` })} <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/system/Buttons.astro", void 0);

const $$Buttons = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ButtonComponent", $$Buttons$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/buttons.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/buttons.astro";
const $$url = "/system/buttons";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Buttons,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
