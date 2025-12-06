import { b as createAstro, c as createComponent, m as maybeRenderHead, r as renderComponent, e as addAttribute, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { b as $$Text, $ as $$BaseLayout, a as $$Wrapper } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { g as getCollection } from '../../chunks/_astro_content_DqmQcJki.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$StoreEntries = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$StoreEntries;
  const { title, url, image, price } = {
    url: "/store/" + Astro2.props.post.slug,
    price: Astro2.props.post.data.price,
    title: Astro2.props.post.data.title,
    image: Astro2.props.post.data.image.url
  };
  return renderTemplate`${maybeRenderHead()}<div class="group-hover:opacity-30 hover:opacity-100 peer hover:peer-hover:opacity-30 duration-300"> <div class="overflow-hidden relative"> ${renderComponent($$result, "Image", $$Image, { "width": "500", "height": "500", "src": image, "alt": Astro2.props.post.data.image.alt, "class": "object-cover aspect-16/10 w-full bg-base-100" })} <a${addAttribute(url, "href")}${addAttribute(title, "title")}> <span class="absolute inset-0"></span> </a> </div> <div class="pt-2"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900 justify-between flex flex-row w-full" }, { "default": ($$result2) => renderTemplate` <span>${title}</span> <span>$${price}</span> ` })} </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/store/StoreEntries.astro", void 0);

const $$Home = createComponent(async ($$result, $$props, $$slots) => {
  const allProducts = await getCollection("store");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`
Digital products for your business
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`
Shop my selection of digital products to help you grow your business,
        and to make your life easier and more productive
` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "pt-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 gap-2 md:grid-cols-3   group"> ${allProducts.map((post) => renderTemplate`${renderComponent($$result3, "StoreEntries", $$StoreEntries, { "post": post })}`)} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/store/home.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/store/home.astro";
const $$url = "/store/home";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Home,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
