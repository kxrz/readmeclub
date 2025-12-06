import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const $$Settings$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col h-full justify-between"> <div class="text-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Settings
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 2xl:text-xl lg:text-balance" }, { "default": ($$result3) => renderTemplate`
Edit your settings
` })} </div> <div> <form action="#" method="POST" class="mx-auto mt-12 max-w-lg"> <div class="flex flex-col gap-y-2"> <!-- First Name --> <div> <label class="sr-only"> First Name </label> <div> <input type="text" name="first_name" id="first_name" autocomplete="given-name" required aria-required="true" aria-describedby="first-name-error" placeholder="First Name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="first-name-error" class="text-red-600 text-sm hidden">
Please enter your first name.
</span> </div> </div> <!-- Last Name --> <div> <label class="sr-only"> Last Name </label> <div> <input type="text" name="last_name" id="last_name" autocomplete="family-name" required aria-required="true" aria-describedby="last-name-error" placeholder="Last Name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="last-name-error" class="text-red-600 text-sm hidden">
Please enter your last name.
</span> </div> </div> <!-- Email --> <div> <label class="sr-only"> Email </label> <div> <input type="email" name="email" id="email" autocomplete="email" required aria-required="true" aria-describedby="email-error" placeholder="Your email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="email-error" class="text-red-600 text-sm hidden">
Please enter a valid email address.
</span> </div> </div> <div class="flex flex-col gap-2"> <div class="flex items-center gap-3"> <input id="remember-me" name="remember-me" type="checkbox" class="text-accent-500 text-xs size-4 border-base-200 rounded-full focus:ring-accent-500 focus:border-accent-500"> <label class="undefined block text-sm  text-base-600 font-medium">
Get email from us?
</label> </div> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": "/forms/reset", "aria-label": "Your label", "variant": "textXS", "class": " text-base-600" }, { "default": ($$result3) => renderTemplate`
Receive a weekly digest of new tools on Wenesday, plus other
                  news.
` })} </div> <!-- Password --> <div class="mt-8"> <label class="sr-only">
Password
<a class="undefined"> Forgot password? </a> </label> <div> <input type="password" name="password" id="password" autocomplete="current-password" required aria-required="true" aria-describedby="password-error" placeholder="Your password" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="password-error" class="text-red-600 text-sm hidden">
Please enter a valid password.
</span> </div> </div> </div> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textXS", "href": "/forms/reset", "aria-label": "Your label", "variant": "textXS", "class": " text-base-600 mt-2" }, { "default": ($$result3) => renderTemplate`
Leave blank if you don't want to change
` })} <!-- Confirm Password --> <div class="mt-4"> <label class="sr-only"> Confirm Password </label> <div> <input type="password" name="confirm_password" id="confirm_password" required aria-required="true" aria-describedby="confirm-password-error" placeholder="Confirm Password" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <span id="confirm-password-error" class="text-red-600 text-sm hidden">
Passwords do not match.
</span> </div> </div> </form> </div> <div class="mt-10"> ${renderComponent($$result2, "Button", $$Button, { "size": "base", "submit": "true", "variant": "default", "class": "w-full justify-center" }, { "default": ($$result3) => renderTemplate`
Update
` })} </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/Settings.astro", void 0);

const $$Settings = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Settingsform", $$Settings$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/settings.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/settings.astro";
const $$url = "/dashboard/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
