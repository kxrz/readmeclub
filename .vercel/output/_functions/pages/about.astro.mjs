import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../chunks/BaseLayout_CO6ejgXa.mjs';
export { renderers } from '../renderers.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`
Who we are
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result4) => renderTemplate`
Get to know us
` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-6" }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col gap-4  text-base-600"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase" }, { "default": ($$result4) => renderTemplate`
Trendspotter is a vibrant, community-driven platform designed to bring
          together creatives from all walks of life. Whether you're a designer
          looking to refine your craft, a developer exploring the latest in
          front-end tools, or a creative professional seeking fresh inspiration,
          Trendspotter is the go-to hub for staying ahead of the curve. By
          providing access to the latest trends in design, typography, and
          graphics tools, we aim to empower our users with cutting-edge
          resources and innovative ideas.
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase" }, { "default": ($$result4) => renderTemplate`
More than just a resource center, Trendspotter fosters a collaborative
          environment where users can exchange insights, share experiences, and
          showcase their own work. Our curated collections and regularly updated
          content ensure that members always have access to the freshest ideas
          and techniques in the creative world. From tutorials and in-depth
          articles to trend analyses and tool reviews, our platform offers
          something for everyone looking to elevate their work and streamline
          their workflow.
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase" }, { "default": ($$result4) => renderTemplate`
At Trendspotter, we believe that creativity thrives in a connected
          community. That’s why we continuously strive to create a space where
          inspiration meets innovation, enabling our members to push boundaries
          and explore new horizons. Join us today to become part of a dynamic
          network of forward-thinking individuals passionate about shaping the
          future of design and creativity.
` })} </div> <div class="mt-24 text-right"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": " text-base-600 italic" }, { "default": ($$result4) => renderTemplate`
"Creativity thrives in collaboration. Thank you for being a part of our journey."
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 mt-2\u220F font-semibold" }, { "default": ($$result4) => renderTemplate`
— Alex Johnson, CEO of Trendspotter
` })} </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/about.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
