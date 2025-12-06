import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, y as renderSlot } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { g as getCollection } from '../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://readme.club");
const $$InfoPagesLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$InfoPagesLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "textXL", "class": "text-base-900 mt-4 lg:text-balance 2xl:text-3xl" }, { "default": ($$result4) => renderTemplate`${frontmatter.page}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result4) => renderTemplate`
Last upadated on ${frontmatter.pubDate.toString().slice(0, 10)}` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "narrow" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Wrapper", $$Wrapper, { "variant": "prose" }, { "default": ($$result4) => renderTemplate`${renderSlot($$result4, $$slots["default"])}` })} ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/layouts/InfoPagesLayout.astro", void 0);

const $$Astro = createAstro("https://readme.club");
async function getStaticPaths() {
  const infoPages = await getCollection("infopages");
  const paths = infoPages.map((page) => {
    return {
      params: { slug: page.slug },
      props: { page },
      trailingSlash: false
    };
  });
  return paths;
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props;
  const { Content } = await page.render();
  return renderTemplate`${renderComponent($$result, "InfoPagesLayout", $$InfoPagesLayout, { "frontmatter": page.data }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/infopages/[...slug].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/infopages/[...slug].astro";
const $$url = "/infopages/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
