import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$CreateCollectionModal, a as $$EditCollectionModal } from '../../chunks/CreateCollectionModal_BaquATJM.mjs';
import { $ as $$RemoveCollectionModal } from '../../chunks/RemoveCollectionModal_CuRlznwR.mjs';
export { renderers } from '../../renderers.mjs';

const $$CollectionDetails$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Design tools
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Manage your saved tools by adding, deleting, or renaming your collections.
` })} ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": ($$result2) => renderTemplate` <div class="border-t border-base-200 pt-2 flex items-center justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase  text-base-600" }, { "default": ($$result3) => renderTemplate`All design tools` })} <div class="flex items-center gap-x-2 relative ml-auto"> <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
New collection
</button> ${renderComponent($$result2, "CreateCollectionModal", $$CreateCollectionModal, {})} </div> <span aria-hidden="true">·</span> <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
Edit
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <span aria-hidden="true">·</span> <div x-data="{ open: false }"> <button x-on:click="open = true" class="text-xs" aria-label="Delete" title="Delete all collecton">
Delete collection
</button> ${renderComponent($$result2, "RemoveCollectionModal", $$RemoveCollectionModal, {})} </div> </div> </div> <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 mt-8"> <div x-data="{ show: true }" x-show="show"> <div class="overflow-hidden relative"> <img src="/images/thumbnail/12.png" data-image-component="true" alt="Put your alt text" width="500" height="500" loading="lazy" decoding="async" class="object-cover aspect-16/10 w-full"> <a href="/tools/tool/10" title="the Blimp"> <span class="absolute inset-0"></span> </a> </div> <div class="pt-2"> <div class="flex items-center lg:justify-between"> <h3 class="text-base font-medium text-base-900">Hello</h3> <div class="flex items-center gap-1"> <a href="#_" title="the Blimp"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path></svg> </a> <span aria-hidden="true">·</span> <button @click="show = false" class="text-xs" aria-label="Delete" title="Delete this card">
Remove
</button> </div> </div> </div> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/CollectionDetails.astro", void 0);

const $$CollectionDetails = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Collection", $$CollectionDetails$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/collection-details.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/collection-details.astro";
const $$url = "/dashboard/collection-details";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CollectionDetails,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
