import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$SubmitModal } from '../../chunks/SubmitModal_D_ywGjxO.mjs';
export { renderers } from '../../renderers.mjs';

const $$Submissions$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Submissions
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Your submitted tools
` })} <div class="mt-12" x-data="{ open: false }"> <!-- Trigger --> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer" x-on:click="open = true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> <!-- Modal --> ${renderComponent($$result2, "SubmitModal", $$SubmitModal, {})} </div> ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-6" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col gap-4"> <div class="flex items-baseline lg:justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
https://lexingtonthemes.com
` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <a href="#_" title="#_"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path></svg> </a> </div> <div class="flex items-baseline lg:justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
https://oxbowui.com
` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <a href="#_" title="#_"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path></svg> </a> </div> <div class="flex items-baseline lg:justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
https://colorsandfonts.com
` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <a href="#_" title="#_"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path></svg> </a> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/Submissions.astro", void 0);

const $$Submissions = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Submitted", $$Submissions$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/submissions.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/submissions.astro";
const $$url = "/dashboard/submissions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Submissions,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
