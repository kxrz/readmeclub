import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
export { renderers } from '../renderers.mjs';

const $$Advertise = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`
Advertsie
` })} ` })} ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col h-full justify-between bg-base-50 border-base-200 max-w-lg mx-auto"> <div class="p-8"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textXL", "class": "text-base-900 font-semibold hover:text-accent-500 tracking-tight" }, { "default": ($$result4) => renderTemplate`
Advertsie on Trendspotter - <br> and put your tool in front - <br> of thousands of visitors
` })} </div> <div class="p-8 border-t border-base-200 flex flex-col gap-12 mt-50"> <div class="flex items-center gap-2 justify-between"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600 w-1/2" }, { "default": ($$result4) => renderTemplate`
Show your tool on website newsletters, blog, and social media.
` })} <span> <span class="text-lg tracking-tighter"> <span x-show="duration === 'monthly'"> <span x-show="duration === 'monthly'">/m</span> </span><span x-show="duration === 'annual'" style="display: none">
/a</span> </span> <span class="text-4xl tracking-tighter font-semibold" data-monthly="$1229" data-annual="$1000" x-text="$el.dataset[duration]"></span> </span> </div> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> </div> </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/advertise.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/advertise.astro";
const $$url = "/advertise";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Advertise,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
