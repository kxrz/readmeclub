import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$CreateCollectionModal, a as $$EditCollectionModal } from '../../chunks/CreateCollectionModal_B9Vg0M7D.mjs';
export { renderers } from '../../renderers.mjs';

const $$Collections$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Collections
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Manage your saved tools by adding, deleting, or renaming your collections.
` })} <div class="mt-12" x-data="{ open: false }"> <!-- Trigger --> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer" x-on:click="open = true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> <!-- Modal --> ${renderComponent($$result2, "CreateCollectionModal", $$CreateCollectionModal, {})} </div> ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-6" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col gap-4"> <div x-data="{ show: true }" x-show="show" class="transition-all"> <div class="flex items-baseline lg:justify-between relative"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
Design tools
<a href="/dashboard/collection-details" title="the Blimp"> <span class="absolute inset-0"></span> </a> ` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <div class="flex items-center gap-x-2 relative ml-auto"> <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
Edit
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <span aria-hidden="true">·</span> <button @click="show = false" class="text-xs" aria-label="Delete" title="Delete this card">
Delete
</button> </div> </div> </div> <div x-data="{ show: true }" x-show="show" class="transition-all"> <div class="flex items-baseline lg:justify-between relative"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": " font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
Developer tools
<a href="/dashboard/collection-details" title="the Blimp"> <span class="absolute inset-0"></span> </a> ` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <div class="flex items-center gap-x-2 relative ml-auto"> <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
Edit
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <span aria-hidden="true">·</span> <button @click="show = false" class="text-xs" aria-label="Delete" title="Delete this card">
Delete
</button> </div> </div> </div> <div x-data="{ show: true }" x-show="show" class="transition-all"> <div class="flex items-baseline lg:justify-between relative"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": " font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
Productivity
<a href="/dashboard/collection-details" title="the Blimp"> <span class="absolute inset-0"></span> </a> ` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <div class="flex items-center gap-x-2 relative ml-auto"> <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
Edit
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <span aria-hidden="true">·</span> <button @click="show = false" class="text-xs" aria-label="Delete" title="Delete this card">
Delete
</button> </div> </div> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/Collections.astro", void 0);

const $$Collections = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CollectionsStructure", $$Collections$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/collections.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/collections.astro";
const $$url = "/dashboard/collections";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Collections,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
