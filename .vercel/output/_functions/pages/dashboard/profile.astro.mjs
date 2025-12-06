import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { b as $$Text, a as $$Wrapper, $ as $$BaseLayout } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { $ as $$DeleteAccountModal } from '../../chunks/DeleteAccountModal_BrLnEl5-.mjs';
import { $ as $$Button } from '../../chunks/Button_B6723hw2.mjs';
export { renderers } from '../../renderers.mjs';

const Avatar = new Proxy({"src":"/_astro/avatar.PvlEUVsY.jpeg","width":2400,"height":2400,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/images/avatar.jpeg";
							}
							
							return target[name];
						}
					});

const $$EditProfile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div x-show="open" role="dialog" aria-modal="true" style="display: none;" x-id="['modal-title']" aria-labelledby="modal-title-3" :aria-labelledby="$id('modal-title')" x-on:keydown.escape.prevent.stop="open = false" class="fixed inset-0 z-50 w-screen overflow-y-hidden"> <!-- Overlay --> <div x-show="open" x-transition.opacity="" style="display: none;" class="fixed inset-0 bg-base-200/80"></div> <!-- Panel --> <div x-show="open" x-on:click="open = false" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="transform opacity-0 translate-y-full" x-transition:enter-end="transform opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="transform opacity-100 translate-y-0" x-transition:leave-end="transform opacity-0 translate-y-full" class="relative flex min-h-screen items-center justify-center p-4" style="display: none;"> <div x-on:click.stop="" x-trap.noscroll.inert="open" class="relative w-full max-w-sm overflow-y-auto bg-white"> <div class="relative p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-medium text-base-900 text-center" }, { "default": ($$result2) => renderTemplate`
Edit profile
` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "font-medium  text-base-600 text-center mt-2 text-balance" }, { "default": ($$result2) => renderTemplate`
Rename your collection
` })} <form class="mt-4 flex flex-col gap-2"> <div> <label for="name" class="sr-only">Name</label> <input id="name" name="name" type="text" placeholder="Name" aria-placeholder="Name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> <div> <label for="last-name" class="sr-only">Last Name</label> <input id="last-name" name="last-name" type="text" placeholder="Last Name" aria-placeholder="Last Name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> <div> <label for="x" class="sr-only">x Username</label> <input id="x" name="x" type="text" placeholder="X Username" aria-placeholder="X Username" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> <div> <label for="email" class="sr-only">Email</label> <input id="email" name="email" type="email" placeholder="Email" aria-placeholder="Email" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> <div> <label for="website" class="sr-only">Website</label> <input id="website" name="website" type="url" placeholder="Website" aria-placeholder="Website" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> ${renderComponent($$result, "Button", $$Button, { "size": "base", "submit": "true", "variant": "default", "class": "w-full justify-center" }, { "default": ($$result2) => renderTemplate`
Update
` })} </form> </div> </div> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/EditProfile.astro", void 0);

const $$Profile$1 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "heroNarrow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Profile
` })} <div class="flex items-center gap-2 mt-4"> <div> ${renderComponent($$result2, "Image", $$Image, { "src": Avatar, "alt": "#_", "width": "1000", "height": "1000", "class": "inline-block size-9 rounded-full" })} </div> <div class="w-full"> <div class="flex items-center gap-2 justify-between w-full"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 font-medium" }, { "default": ($$result3) => renderTemplate`
Kalle Nygren
` })} <div x-data="{ open: false }"> <button class="flex text-xs items-center" x-on:click="open = true">
Edit
</button> ${renderComponent($$result2, "EditProfile", $$EditProfile, {})} </div> </div> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-xs  text-base-600 font-medium" }, { "default": ($$result3) => renderTemplate`
Profile created on 2025-01-01
` })} </div> </div> ` })} </section> <section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-6" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col gap-4"> <div class="flex items-baseline lg:justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
Website
` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "href": "#_", "title": "#_" }, { "default": ($$result3) => renderTemplate` yourwebsite.com ` })} </div> <div class="flex items-baseline lg:justify-between"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result3) => renderTemplate`
X User name
` })} <span class="flex-1 mx-2 border-dotted border-b border-base-300"></span> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "href": "#_", "title": "#_" }, { "default": ($$result3) => renderTemplate` @yourhandle ` })} </div> </div> <div x-data="{ open: false }" class="mt-8"> <div class="border-t border-base-200 pt-2"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase  text-base-600" }, { "default": ($$result3) => renderTemplate`Delete your account` })} </div> <button class="size-15 bg-red-500 mt-12 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer" x-on:click="open = true"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg> </button> ${renderComponent($$result2, "DeleteAccountModal", $$DeleteAccountModal, {})} </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/dashboard/Profile.astro", void 0);

const $$Profile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "UserProfile", $$Profile$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/profile.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/dashboard/profile.astro";
const $$url = "/dashboard/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Profile,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
