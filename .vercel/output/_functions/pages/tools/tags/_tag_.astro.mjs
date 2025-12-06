import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Link } from '../../../chunks/Link_Ins73ZxP.mjs';
import { $ as $$FiltersSidebar, a as $$BigCard } from '../../../chunks/BigCard_secUVypL.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
async function getStaticPaths() {
  const allTools = await getCollection("tools");
  const uniqueTags = [
    ...new Set(allTools.map((post) => post.data.tags).flat())
  ];
  return uniqueTags.map((tag) => {
    const filteredPosts = allTools.filter(
      (post) => post.data.tags.includes(tag)
    );
    return {
      params: { tag },
      props: { tools: filteredPosts }
    };
  });
}
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const alltools = await getCollection("tools");
  const { tag } = Astro2.params;
  const allTags = [...new Set(alltools.flatMap((post) => post.data.tags || []))];
  const sortedTags = allTags.sort((a, b) => a.localeCompare(b));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": tag }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`
Explore web apps related to ${tag}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`
Discover all the resources and tools about ${tag}.
` })} ` })} </section> <section x-data="{ leftDrawerOpen: false }" @keydown.window.escape="open = false"> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center gap-2"> ${renderComponent($$result3, "FiltersSidebar", $$FiltersSidebar, { "tags": sortedTags, "categories": Array.from(new Set(alltools.map((post) => (post.data.details || []).find((d) => d.label === "Category")?.value).filter(Boolean))).sort((a, b) => a.localeCompare(b)), "types": Array.from(new Set(alltools.map((post) => (post.data.details || []).find((d) => d.label === "Type")?.value).filter(Boolean))).sort((a, b) => a.localeCompare(b)) })} <div class="scrollable-content relative flex snap-x snap-proximity gap-2 py-2 px-2 overflow-x-scroll scrollbar-hide"> ${sortedTags.map((tag2) => renderTemplate`${renderComponent($$result3, "Link", $$Link, { "size": "xs", "variant": "ghost", "title": tag2, "aria-label": tag2, "href": `/tools/tags/${tag2}`, "class": "capitalize" }, { "default": async ($$result4) => renderTemplate`${tag2}` })}`)} </div> </div> <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-2"> ${alltools.filter((post) => post.data.tags.includes(tag)).map((filteredPost) => renderTemplate`${renderComponent($$result3, "BigCard", $$BigCard, { "post": filteredPost })}`)} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tags/[tag].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tags/[tag].astro";
const $$url = "/tools/tags/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
