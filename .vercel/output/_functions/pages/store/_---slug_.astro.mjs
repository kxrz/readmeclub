import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from '../../chunks/Link_Ins73ZxP.mjs';
import { g as getCollection } from '../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://readme.club");
const $$StoreLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StoreLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col gap-12"> <div class="lg:col-span-2"> ${renderComponent($$result3, "Image", $$Image, { "width": "500", "height": "500", "src": frontmatter.image.url, "alt": frontmatter.image.alt ?? "Fallback alt text if none provided", "class": "object-cover aspect-16/10 w-full bg-base-100" })} </div> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight flex items-center justify-between gap-2 w-full" }, { "default": ($$result4) => renderTemplate`${frontmatter.title}<span>$${frontmatter.price}</span>` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600" }, { "default": ($$result4) => renderTemplate`${frontmatter.description}` })} <div class="mt-10 gap-2 grid grid-cols-1 sm:grid-cols-2"> ${renderComponent($$result3, "Link", $$Link, { "href": frontmatter.checkout, "size": "base", "variant": "default", "class": "w-full md:w-auto justify-center" }, { "default": ($$result4) => renderTemplate`
Buy ${frontmatter.title} for $${frontmatter.price}` })} ${renderComponent($$result3, "Link", $$Link, { "href": frontmatter.preview, "size": "base", "variant": "muted", "class": "w-full justify-center md:w-auto" }, { "default": ($$result4) => renderTemplate`
Preview demo
` })} </div> <!-- Accordion sections --> <div class="divide-y divide-base-200 border-y border-base-200 mt-8"> <details class="group cursor-pointer"> <summary class="text-sm leading-normal text-base-900 font-medium flex items-center justify-between w-full py-4 text-left select-none hover:text-accent-500 focus:text-accent-500">
Details<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4 duration-300 ease-out transform group-open:-rotate-45"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </summary> <div class="pb-4"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600" }, { "default": ($$result4) => renderTemplate`
This product is crafted from high-quality materials designed
                  for durability and comfort. It features modern design elements
                  and is perfect for everyday use.
` })} <ul role="list" class="mt-4"> ${frontmatter.highlights.map((highlight) => renderTemplate`<li> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600 text-balance  font-medium" }, { "default": ($$result4) => renderTemplate`${highlight}` })} </li>`)} </ul> </div> </details> <details class="group cursor-pointer"> <summary class="text-sm leading-normal text-base-900 font-medium flex items-center justify-between w-full py-4 text-left select-none hover:text-accent-500 focus:text-accent-500">
Key points<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4 duration-300 ease-out transform group-open:-rotate-45"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </summary> <div class="pb-4"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600" }, { "default": ($$result4) => renderTemplate`
We offer free standard shipping on all orders above $50.
                  Express shipping options are available at checkout for an
                  additional fee.
` })} <dl class="flex flex-col gap-4 mt-8 md:col-span-2 lg:col-span-1"> ${frontmatter.features.map((feature) => renderTemplate`<div> <dt> ${renderComponent($$result3, "Text", $$Text, { "tag": "span", "variant": "textSM", "class": "text-base-900 " }, { "default": ($$result4) => renderTemplate`${feature.title}` })} </dt> <dd class="mt-1  text-base-600"> ${renderComponent($$result3, "Text", $$Text, { "tag": "span", "variant": "textSM" }, { "default": ($$result4) => renderTemplate`${feature.description}` })} </dd> </div>`)} </dl> </div> </details> <details class="group cursor-pointer"> <summary class="text-sm leading-normal text-base-900 font-medium flex items-center justify-between w-full py-4 text-left select-none hover:text-accent-500 focus:text-accent-500">
License<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4 duration-300 ease-out transform group-open:-rotate-45"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </summary> <div class="pb-4"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600 text-balance" }, { "default": ($$result4) => renderTemplate`${frontmatter.license}` })} </div> </details> </div> </div> </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/layouts/StoreLayout.astro", void 0);

const $$Astro = createAstro("https://readme.club");
const prerender = false;
async function getStaticPaths() {
  const store = await getCollection("store");
  const paths = store.map((page) => {
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
  return renderTemplate`${renderComponent($$result, "StoreLayout", $$StoreLayout, { "frontmatter": page.data }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Content", Content, {})}` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/store/[...slug].astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/store/[...slug].astro";
const $$url = "/store/[...slug]";

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
