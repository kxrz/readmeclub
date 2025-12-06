import rss, { pagesGlobToRssItems } from '@astrojs/rss';
export { renderers } from '../renderers.mjs';

async function GET(context) {
  return rss({
     title: 'Lexington Themes',
    description: 'Free and premium multipage themes and UI Kits For freelancers, developers, businesses, and personal use.Beautifully crafted with Astro.js, and Tailwind CSS — Simple & easy to customise.',
    site: context.site,
    items: await pagesGlobToRssItems(
      /* #__PURE__ */ Object.assign({}),
    ),
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
