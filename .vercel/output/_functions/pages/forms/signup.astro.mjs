import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { G as Gif } from '../../chunks/forms_C9LxtkCu.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$Signup$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 gap-12 items-start"> ${renderComponent($$result2, "Image", $$Image, { "class": "object-cover lg:col-span-2", "width": "1000", "height": "1000", "src": Gif, "alt": "#_" })} <div class="flex flex-col h-full justify-between"> <div> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Sign up
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 2xl:text-xl lg:text-balance" }, { "default": ($$result3) => renderTemplate`
Welcome ! Sign up with your favourite email
` })} </div> <div> <form action="#" method="POST" class="mx-auto mt-12 max-w-lg"> <div class="flex flex-col gap-y-2"> <div> <label class="sr-only"> Name </label> <div> <input type="text" name="name" id="name" autocomplete="name" required aria-required="true" aria-describedby="name-error" placeholder="Your name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="name-error" class="text-red-600 text-sm hidden">
Please enter your name.
</span> </div> </div> <div> <label class="sr-only"> Email </label> <div> <input type="email" name="email" id="email" autocomplete="email" required aria-required="true" aria-describedby="email-error" placeholder="Your email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="email-error" class="text-red-600 text-sm hidden">
Please enter a valid email address.
</span> </div> </div> <div> <label class="sr-only">
Password
<a class="undefined"> Forgot password? </a> </label> <div> <input type="password" name="password" id="password" autocomplete="current-password" required aria-required="true" aria-describedby="password-error" placeholder="Your password" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="password-error" class="text-red-600 text-sm hidden">
Please enter a valid password.
</span> </div> </div> <div> <label class="sr-only"> Confirm Password </label> <div> <input type="password" name="confirm-password" id="confirm-password" autocomplete="new-password" required aria-required="true" aria-describedby="confirm-password-error" placeholder="Confirm your password" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="confirm-password-error" class="text-red-600 text-sm hidden">
Please confirm your password.
</span> </div> </div> </div> <div class="mt-10"> ${renderComponent($$result2, "Button", $$Button, { "size": "base", "submit": "true", "variant": "default", "class": "w-full justify-center" }, { "default": ($$result3) => renderTemplate`
Continue with email
` })} </div> </form> <div class="flex mt-4 justify-between items-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": " text-base-600 uppercase" }, { "default": ($$result3) => renderTemplate`
Already have an account?
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": "/forms/signin", "aria-label": "Your label", "class": " text-base-600 uppercase hover:text-accent-500 flex items-center gap-1 transition-all duration-200" }, { "default": ($$result3) => renderTemplate`
Sign in instead
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l14 0"></path><path d="M15 16l4 -4"></path><path d="M15 8l4 4"></path></svg> ` })} </div> </div> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/forms/Signup.astro", void 0);

const $$Signup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Sign", $$Signup$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/signup.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/forms/signup.astro";
const $$url = "/forms/signup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Signup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
