import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, a as renderTemplate, y as renderSlot } from '../../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from '../../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { b as $$Text, $ as $$BaseLayout, a as $$Wrapper } from '../../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from '../../../chunks/Link_Ins73ZxP.mjs';
import { $ as $$BookmarksModal } from '../../../chunks/BookmarksModal_DfF0i2GG.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro$2 = createAstro("https://readme.club");
const $$SmallCards = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SmallCards;
  const { title, tagline, url, logo } = {
    url: "/tools/tool/" + Astro2.props.post.slug,
    title: Astro2.props.post.data.title,
    logo: Astro2.props.post.data.logo.url,
    tagline: Astro2.props.post.data.tagline
  };
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(url, "href")}${addAttribute(title, "title")} class="relative flex items-center gap-x-3 rounded-full bg-base-50 p-4 focus-outline-none"> <div class="flex-shrink-0 p-1 size-16 bg-white rounded-full items-center flex justify-center"> ${renderComponent($$result, "Image", $$Image, { "class": "object-cover size-10", "width": "100", "height": "100", "src": logo, "alt": Astro2.props.post.data.logo.alt })} </div> <div class="min-w-0 flex-1"> <span class="absolute inset-0" aria-hidden="true"></span> <div> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textSM", "class": "font-medium text-base-900" }, { "default": ($$result2) => renderTemplate`${title}` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": " text-base-600 mt-1" }, { "default": ($$result2) => renderTemplate`${tagline}` })} </div> </div> </a>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/SmallCards.astro", void 0);

const $$Astro$1 = createAstro("https://readme.club");
const $$ToolsLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ToolsLayout;
  const alltools = await getCollection("tools");
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-3 gap-12"> <div class="lg:col-span-2"> ${renderComponent($$result3, "Image", $$Image, { "width": "2000", "height": "2000", "src": frontmatter.thumbnail.url, "alt": frontmatter.thumbnail.url, "class": "object-cover aspect-16/10 w-full" })} </div> <div class="flex flex-col h-full justify-between"> <div> ${renderComponent($$result3, "Image", $$Image, { "width": "1000", "height": "1000", "src": frontmatter.logo.url, "alt": frontmatter.logo.url, "class": "size-8" })} ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 mt-12 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${frontmatter.title}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance" }, { "default": async ($$result4) => renderTemplate`${frontmatter.tagline}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 mt-12 font-medium uppercase" }, { "default": async ($$result4) => renderTemplate`Details` })} <dl class="relative flex flex-col gap-4 mt-4 w-full"> ${frontmatter.details.map((details) => renderTemplate`<div class="flex items-center lg:justify-between"> <dt class="flex-1"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-900 font-medium flex justify-between" }, { "default": async ($$result4) => renderTemplate` <span>${details.label}</span> <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> ` })} </dt> <dd class="mt-1  text-base-600"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600" }, { "default": async ($$result4) => renderTemplate`${details.value}` })} </dd> </div>`)} </dl> </div> <div class="flex items-center mt-8 justify-between"> ${renderComponent($$result3, "Link", $$Link, { "size": "xs", "variant": "ghost", "href": frontmatter.live, "title": frontmatter.title, "class": "justify-center flex items-center gap-1 w-auto" }, { "default": async ($$result4) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-link size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 15l6 -6"></path><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path></svg>
Visit ${frontmatter.title}` })} <div class="flex items-center gap-1"> ${renderComponent($$result3, "BookmarksModal", $$BookmarksModal, {})} <button> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-heart size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path></svg> </button> </div> </div> </div> </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-2xl"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": " text-base-600 text-balance" }, { "default": async ($$result4) => renderTemplate`${frontmatter.description}` })} ${renderComponent($$result3, "Wrapper", $$Wrapper, { "variant": "prose" }, { "default": async ($$result4) => renderTemplate` ${renderSlot($$result4, $$slots["default"])} ` })} </div> ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-col gap-4 lg:flex-row lg:justify-between border-t border-base-200 pt-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase  text-base-600" }, { "default": async ($$result4) => renderTemplate`Latest additions` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "a", "href": "/tools/home", "aria-label": "Your label", "class": " text-base-600 text-xs uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": async ($$result4) => renderTemplate`
See all tools
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l14 0"></path><path d="M15 16l4 -4"></path><path d="M15 8l4 4"></path></svg> ` })} </div> <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4 mt-4"> ${alltools.slice(8, 12).map((post) => renderTemplate`${renderComponent($$result3, "SmallCards", $$SmallCards, { "post": post })}`)} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/layouts/ToolsLayout.astro", void 0);

const $$Astro = createAstro("https://readme.club");
const prerender = false;
async function getStaticPaths() {
  const tools = await getCollection("tools");
  const paths = tools.map((page) => {
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
  return renderTemplate`${renderComponent($$result, "ToolsLayout", $$ToolsLayout, { "frontmatter": page.data }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tool/[...slug].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/tool/[...slug].astro";
const $$url = "/tools/tool/[...slug]";

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
