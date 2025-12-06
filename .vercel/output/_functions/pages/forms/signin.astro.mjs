import { c as createComponent, r as renderComponent, a as renderTemplate, y as renderSlot, m as maybeRenderHead } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { G as Gif } from '../../chunks/forms_C9LxtkCu.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$SimpleLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/layouts/SimpleLayout.astro", void 0);

const $$Signin$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 gap-12 items-start"> ${renderComponent($$result2, "Image", $$Image, { "class": "object-cover lg:col-span-2", "width": "1000", "height": "1000", "src": Gif, "alt": "#_" })} <div class="flex flex-col h-full justify-between"> <div> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Sign in
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 2xl:text-xl lg:text-balance" }, { "default": ($$result3) => renderTemplate`
Welcome back! Sign in with your Google account or your favourite
            email
` })} </div> <div> <form action="#" method="POST" class="mx-auto mt-12 max-w-lg"> <div class="flex gap-4 mt-4"> ${renderComponent($$result2, "Button", $$Button, { "size": "base", "variant": "muted", "class": "w-full justify-center" }, { "default": ($$result3) => renderTemplate`
Sign in with Google
` })} </div> <div class="relative mt-4"> <div class="absolute inset-0 flex items-center" aria-hidden="true"> <div class="w-full border-t border-base-200"></div> </div> <div class="relative flex justify-center"> <span class="bg-white px-4 rounded-full py-1"> ${renderComponent($$result2, "Text", $$Text, { "tag": "span", "variant": "textSM", "class": " text-base-600" }, { "default": ($$result3) => renderTemplate`
Or use your email` })} </span> </div> </div> <div class="flex flex-col gap-y-2 mt-4"> <div> <label class="sr-only"> Email </label> <div> <input type="email" name="email" id="email" autocomplete="email" required aria-required="true" aria-describedby="email-error" placeholder="Your email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="email-error" class="text-red-600 text-sm hidden">
Please enter a valid email address.
</span> </div> </div> <div> <label class="sr-only">
Password
<a class="undefined"> Forgot password? </a> </label> <div> <input type="password" name="password" id="password" autocomplete="current-password" required aria-required="true" aria-describedby="password-error" placeholder="Your password" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="password-error" class="text-red-600 text-sm hidden">
Please enter a valid password.
</span> </div> </div> <div class="flex items-center gap-2 justify-between"> <div class="flex items-center gap-3"> <input id="remember-me" name="remember-me" type="checkbox" class="text-accent-500 text-xs size-4 border-base-200 rounded-full focus:ring-accent-500 focus:border-accent-500"> <label class="undefined block text-sm  text-base-600 font-medium">
Remember me
</label> </div> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": "/forms/reset", "aria-label": "Your label", "class": " text-base-600 uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": ($$result3) => renderTemplate`
forgot password?
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l14 0"></path><path d="M15 16l4 -4"></path><path d="M15 8l4 4"></path></svg> ` })} </div> </div> <div class="mt-10"> ${renderComponent($$result2, "Button", $$Button, { "size": "base", "submit": "true", "variant": "default", "class": "w-full justify-center" }, { "default": ($$result3) => renderTemplate`
Continue with email
` })} </div> </form> <div class="flex mt-4 justify-between items-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": " text-base-600 uppercase" }, { "default": ($$result3) => renderTemplate`
Don't have an account?
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": "/forms/signup", "aria-label": "Your label", "class": " text-base-600 uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": ($$result3) => renderTemplate`
Sign up instead
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l14 0"></path><path d="M15 16l4 -4"></path><path d="M15 8l4 4"></path></svg> ` })} </div> </div> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/forms/Signin.astro", void 0);

const $$Signin = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "SimpleLayout", $$SimpleLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Signin", $$Signin$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/signin.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/signin.astro";
const $$url = "/forms/signin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Signin,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
