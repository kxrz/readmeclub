import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from './_astro_assets_BOyCgF7Z.mjs';
import { b as $$Text } from './BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Link } from './Link_Ins73ZxP.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Insights = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Insights;
  const { title, url, description, pubDate, image } = {
    url: "/blog/posts/" + Astro2.props.post.slug,
    title: Astro2.props.post.data.title,
    image: Astro2.props.post.data.image.url,
    description: Astro2.props.post.data.description,
    pubDate: Astro2.props.post.data.pubDate.toString().slice(0, 10)
  };
  return renderTemplate`${renderComponent($$result, "Link", $$Link, { "href": url, "title": title, "variant": "link", "class": "group-hover:opacity-30 hover:opacity-100 peer hover:peer-hover:opacity-30 duration-300" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Image", $$Image, { "width": "500", "height": "500", "src": image, "alt": title, "class": "object-cover aspect-[16/9]  w-full" })} ${maybeRenderHead()}<div class="px-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "mt-4 text-base-400" }, { "default": ($$result3) => renderTemplate`<time datetime="2020-03-16"> ${pubDate}</time>` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`${title}` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600 mt-2 line-clamp-2" }, { "default": ($$result3) => renderTemplate`${description}` })} </div> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/blog/Insights.astro", void 0);

export { $$Insights as $ };
