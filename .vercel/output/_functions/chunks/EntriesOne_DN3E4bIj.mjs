import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from './_astro_assets_BOyCgF7Z.mjs';
import { b as $$Text } from './BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Link } from './Link_Ins73ZxP.mjs';

const $$Astro = createAstro("https://readme.club");
const $$EntriesOne = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$EntriesOne;
  const { title, url, avatar, tags, pubDate } = {
    url: "/blog/posts/" + Astro2.props.post.slug,
    tags: Astro2.props.post.data.tags,
    title: Astro2.props.post.data.title,
    avatar: Astro2.props.post.data.avatar.url,
    pubDate: Astro2.props.post.data.pubDate.toString().slice(0, 10)
  };
  return renderTemplate`${renderComponent($$result, "Link", $$Link, { "href": url, "title": title, "variant": "link", "class": "grid grid-cols-4 gap-4 md:grid-cols-8 py-4 items-center border-b border-base-200 duration-300 group-hover:opacity-30 hover:opacity-100 peer hover:peer-hover:opacity-30" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="col-span-full md:col-span-5"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textSM", "class": "text-base-900 font-medium hover:opacity-60 2xl:text-base transition-opacity duration-200" }, { "default": ($$result3) => renderTemplate`${title}` })} </div> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-base-400 font-medium" }, { "default": ($$result3) => renderTemplate`<time datetime="2020-03-16">${tags}</time>` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-base-400 font-medium lg:mx-auto col-span-2 md:col-span-1" }, { "default": ($$result3) => renderTemplate`<time datetime="2020-03-16">${pubDate}</time>` })} <div class="flex items-center gap-2  text-base-600 col-span-full md:col-span-1 md:ml-auto"> ${renderComponent($$result2, "Image", $$Image, { "width": "500", "height": "500", "src": avatar, "alt": title, "class": "size-8 rounded-full" })} </div> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/blog/EntriesOne.astro", void 0);

export { $$EntriesOne as $ };
