import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute, C as Fragment, y as renderSlot } from '../../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from '../../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from '../../../chunks/Link_Ins73ZxP.mjs';
import { $ as $$SubscribeCta } from '../../../chunks/SubscribeCta_dk7JgIAS.mjs';
import { $ as $$Insights } from '../../../chunks/Insights_BA_uzwBD.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$1 = createAstro("https://readme.club");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { frontmatter } = Astro2.props;
  const allPostsUnsorted = await getCollection("posts");
  const allPosts = allPostsUnsorted.sort(
    (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate)
  );
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "textXL", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${frontmatter.title}` })} <div class="flex gap-4 flex-col md:flex-row mt-4 items-center justify-between"> <div class="flex items-center gap-x-3"> ${renderComponent($$result3, "Image", $$Image, { "width": "500", "height": "500", "src": frontmatter.avatar.url, "alt": frontmatter.avatar.url, "class": "object-cover size-10 rounded-full" })} <div class="flex flex-col  text-base-600"> <time${addAttribute(frontmatter.pubDate.toString().slice(0, 10), "datetime")}> ${renderComponent($$result3, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "font-medium" }, { "default": async ($$result4) => renderTemplate`Written on ${frontmatter.pubDate.toString().slice(0, 10)}` })} </time> ${renderComponent($$result3, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "font-medium" }, { "default": async ($$result4) => renderTemplate`
by ${frontmatter.author}` })} </div> </div> <div class="flex flex-wrap items-center gap-1"> ${frontmatter.tags.map((tag) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "Link", $$Link, { "title": tag, "size": "sm", "variant": "muted", "aria-label": tag, "href": `/blog/tags/${tag}`, "class": "text-accent-500  font-medium text-xs hover:text-base-900     " }, { "default": async ($$result5) => renderTemplate`${tag}` })} ` })}`)} </div> </div> ${renderComponent($$result3, "Image", $$Image, { "width": "500", "height": "500", "src": frontmatter.image.url, "alt": frontmatter.image.url, "class": "object-cover aspect-16/9 mt-8 w-full" })} <div class="text-center"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance" }, { "default": async ($$result4) => renderTemplate`${frontmatter.description}` })} </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "narrow" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Wrapper", $$Wrapper, { "variant": "prose" }, { "default": async ($$result4) => renderTemplate`${renderSlot($$result4, $$slots["default"])}` })} ` })} </section> ${renderComponent($$result2, "SubscribeCta", $$SubscribeCta, {})} <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-12" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mt-8 group"> ${allPosts.slice(0, 4).map((post) => renderTemplate`${renderComponent($$result3, "Insights", $$Insights, { "post": post })}`)} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/layouts/BlogLayout.astro", void 0);

const $$Astro = createAstro("https://readme.club");
const prerender = false;
async function getStaticPaths() {
  const blogEntries = await getCollection("posts");
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { entry } = Astro2.props;
  const { Content } = await entry.render();
  return renderTemplate`${renderComponent($$result, "BlogLayout", $$BlogLayout, { "frontmatter": entry.data }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/blog/posts/[...slug].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/blog/posts/[...slug].astro";
const $$url = "/blog/posts/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
