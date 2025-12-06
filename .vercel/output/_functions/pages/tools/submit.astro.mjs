import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$Link } from '../../chunks/Link_Ins73ZxP.mjs';
import { $ as $$SubmitModal } from '../../chunks/SubmitModal_5LDaOiFM.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$Submit$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Submit your tool to Trendspotter
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Get your web tool noticed by top develpers and designers and increase
      their reach!
` })} ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "prose" }, { "default": ($$result3) => renderTemplate` <h4>Get your web tools featured</h4> <p>
Submit your web tools for free and get them noticed by top designers.
        Every submission is carefully reviewed.
</p> <h4>Submission process</h4> <p>
It may take 2 or 3 years or more to publish your tool due to high
        demand, who knows. For $99 bucks, you can skip the wait and receive a
        review in 7 days, though publication is not guaranteed.
</p> <div class="flex not-prose items-center gap-2"> <div x-data="{ open: false }"> <!-- Trigger --> <span x-on:click="open = true"> ${renderComponent($$result3, "Button", $$Button, { "size": "sm", "variant": "default", "title": "#_", "href": "/submit", "class": "justify-center flex items-center gap-1" }, { "default": ($$result4) => renderTemplate` <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg>
Submit a tool
` })} </span> <!-- Modal --> ${renderComponent($$result3, "SubmitModal", $$SubmitModal, {})} </div> ${renderComponent($$result3, "Link", $$Link, { "size": "sm", "variant": "muted", "href": "/pricing", "title": "#_", "class": "justify-center w-auto not-prose" }, { "default": ($$result4) => renderTemplate`
Skip the waiting line for $299
` })} </div> <h4>If not selected</h4> <p>Don’t give up—refine your tool and try again with future projects.</p> ` })} ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/forms/Submit.astro", void 0);

const $$Submit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SubmitForm", $$Submit$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/submit.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/submit.astro";
const $$url = "/tools/submit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Submit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
