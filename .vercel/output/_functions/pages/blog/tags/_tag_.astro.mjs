import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Insights } from '../../../chunks/Insights_BA_uzwBD.mjs';
import { $ as $$EntriesOne } from '../../../chunks/EntriesOne_Brlf-5Qd.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
async function getStaticPaths() {
  const allPosts = await getCollection("posts");
  const uniqueTags = [
    ...new Set(allPosts.map((post) => post.data.tags).flat())
  ];
  return uniqueTags.map((tag) => {
    const filteredPosts = allPosts.filter(
      (post) => post.data.tags.includes(tag)
    );
    return {
      params: { tag },
      props: { posts: filteredPosts }
    };
  });
}
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const { tag } = Astro2.params;
  const { posts } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": tag }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 2xl:text-5xl" }, { "default": async ($$result4) => renderTemplate`
All our blogs tagged with ${tag}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`
Read all about ${tag} here.
` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mt-8 group"> ${posts.slice(0, 3).map((post) => renderTemplate`${renderComponent($$result3, "Insights", $$Insights, { "post": post })}`)} </div> <div class="flex flex-col group mt-12"> ${posts.map((post) => renderTemplate`${renderComponent($$result3, "EntriesOne", $$EntriesOne, { "post": post })}`)} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/blog/tags/[tag].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/blog/tags/[tag].astro";
const $$url = "/blog/tags/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
