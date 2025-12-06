import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$Contact$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow", "class": "relative flex flex-col items-center justify-center h-svh" }, { "default": ($$result2) => renderTemplate` <div class="text-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "textXL", "class": "text-base-900 font-medium 2xl:text-3xl" }, { "default": ($$result3) => renderTemplate`
Get in touch
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-lg" }, { "default": ($$result3) => renderTemplate`
Found a bug, or have a suggestion? Let us know!
` })} </div> <form action="#" method="POST" class="relative w-full max-w-sm mx-auto mt-4 overflow-y-auto bg-white ring-1 ring-base-200 rounded-2xl p-8 lg:p-12"> <div class="grid grid-cols-1 gap-2 sm:grid-cols-2"> <div> <label for="first-name" class="sr-only">First name</label> <div> <input type="text" name="first-name" id="first-name" placeholder="Your name" autocomplete="given-name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div> <label for="last-name" class="sr-only">Last name</label> <div> <input type="text" name="last-name" placeholder="Your last name" id="last-name" autocomplete="family-name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="company" class="sr-only">Company</label> <div> <input type="text" name="company" id="company" placeholder="Company name" autocomplete="organization" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="email" class="sr-only">Email</label> <div> <input type="email" name="email" placeholder="Your best email!" id="email" autocomplete="email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="message" class="sr-only">Message</label> <div> <textarea name="message" id="message" placeholder="Your message goes here..." rows="4" class="block w-full px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"></textarea> </div> </div> </div> <div class="mt-2"> ${renderComponent($$result2, "Button", $$Button, { "size": "sm", "submit": "true", "variant": "default", "class": "w-full justify-center" }, { "default": ($$result3) => renderTemplate`
Submit
` })} </div> </form> ` })} </section> <section> <div class="mx-auto max-w-3xl px-8 py-16"> <div> <p class="text-2xl font-medium tracking-tight text-base-900 sm:text-4xl">
Get in touch
</p> </div> <p class="mt-4  text-base-600">
I am open to collaborating on exciting projects with wonderful
      individuals. If you require any assistance, I am more than willing to
      offer my support.
</p> <div class="mt-24 border-y divide-y"> <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start py-12"> <p class="text-lg font-semibold leading-6 text-base-900 group-hover:text-accent-400">
Contact me
</p> <form class="lg:col-span-2"> <div class="grid grid-cols-1 gap-2 sm:grid-cols-2"> <div> <label for="first-name" class="sr-only">First name</label> <div> <input type="text" name="first-name" id="first-name" placeholder="Your name" autocomplete="given-name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div> <label for="last-name" class="sr-only">Last name</label> <div> <input type="text" name="last-name" placeholder="Your last name" id="last-name" autocomplete="family-name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="company" class="sr-only">Company</label> <div> <input type="text" name="company" id="company" placeholder="Company name" autocomplete="organization" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="email" class="sr-only">Email</label> <div> <input type="email" name="email" placeholder="Your best email!" id="email" autocomplete="email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> </div> <div class="sm:col-span-2"> <label for="message" class="sr-only">Message</label> <div> <textarea name="message" id="message" placeholder="Your message goes here..." rows="4" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"></textarea> </div> </div> </div> <div class="mt-2"> <button type="submit" class="inline-flex items-center gap-2 justify-center rounded-lg py-3 px-6 text-sm outline-offset-2 transition bg-black text-white font-medium hover:bg-base-800 group w-full border border-white/20">Submit
</button> </div> </form> </div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start py-12"> <p class="text-lg font-semibold leading-6 text-base-900 group-hover:text-accent-400">
Book a call with me
</p> <div class="rounded-xl flex flex-col gap-12 h-full bg-base-100 p-8 lg:col-span-2"> <p class=" text-base-600 text-sm text-pretty">
Book a call with me to discuss your project and get a better idea of
            what I can do for you. I am available for a call on a few days a
            week. Checkuout my availability below.
</p> <a href="#_" title="your title" aria-label="your label" class="inline-flex items-center gap-2 justify-center rounded-lg py-3 px-6 text-sm outline-offset-2 transition bg-white text-black font-medium hover:bg-base-50 group w-full lg:w-auto border h-10">
Book a call
<span>→</span> </a> </div> </div> </div> </div> </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/forms/Contact.astro", void 0);

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Contact", $$Contact$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/contact.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/contact.astro";
const $$url = "/forms/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
