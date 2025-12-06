import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from '../../chunks/Link_Ins73ZxP.mjs';
import { g as getCollection } from '../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const allTools = await getCollection("tools");
  const tags = [...new Set(allTools.map((post) => post.data.tags).flat())];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`
Explore, and discover new resources.
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`
Here you will find all the tags for our resources.
` })} <ul role="list" class="flex flex-col gap-1 mt-12"> ${tags.map((tag) => renderTemplate`${renderComponent($$result3, "Link", $$Link, { "title": tag, "variant": "link", "aria-label": tag, "href": `/tools/tags/${tag}`, "class": " flex justify-between  text-base-600 capitalize hover:text-accent-500" }, { "default": async ($$result4) => renderTemplate`${tag}<span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M5 12l14 0"></path> <path d="M15 16l4 -4"></path> <path d="M15 8l4 4"></path> </svg> ` })}`)} </ul> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tags/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tags/index.astro";
const $$url = "/tools/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
