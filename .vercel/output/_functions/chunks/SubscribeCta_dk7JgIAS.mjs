import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text } from './BaseLayout_CO6ejgXa.mjs';
import { $ as $$Button } from './Button_B6723hw2.mjs';
import { $ as $$SubscribeModal } from './SubscribeModal_PJIkGWUf.mjs';

const $$SubscribeCta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-24 flex flex-col" }, { "default": ($$result2) => renderTemplate` <div class="text-center"> ${renderComponent($$result2, "Text", $$Text, { "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Join our newsletter
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Stay up to date with our latest news and updates.
` })} </div> <div x-data="{ open: false }" class="mt-8 justify-center flex"> ${renderComponent($$result2, "Button", $$Button, { "x-on:click": "open = true", "size": "sm", "variant": "default", "title": "#_", "href": "/submit", "class": "justify-center flex items-center gap-1" }, { "default": ($$result3) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-mail size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path><path d="M3 7l9 6l9 -6"></path></svg>
Subscribe
` })} ${renderComponent($$result2, "SubscribeModal", $$SubscribeModal, {})} </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/blog/SubscribeCta.astro", void 0);

export { $$SubscribeCta as $ };
