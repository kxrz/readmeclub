import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from './_astro_assets_BOyCgF7Z.mjs';
import { b as $$Text } from './BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Link } from './Link_Ins73ZxP.mjs';

const Gif = new Proxy({"src":"/_astro/time.B3cEeqkx.gif","width":500,"height":500,"format":"gif"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/images/time.gif";
							}
							
							return target[name];
						}
					});

const $$BookmarksModal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div x-show="open" role="dialog" aria-modal="true" style="display: none;" x-id="['modal-title']" aria-labelledby="modal-title-3" :aria-labelledby="$id('modal-title')" x-on:keydown.escape.prevent.stop="open = false" class="fixed inset-0 z-50 w-screen overflow-y-hidden"> <!-- Overlay --> <div x-show="open" x-transition.opacity="" style="display: none;" class="fixed inset-0 bg-base-200/80"></div> <!-- Panel --> <div x-show="open" x-on:click="open = false" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="transform opacity-0 translate-y-full" x-transition:enter-end="transform opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="transform opacity-100 translate-y-0" x-transition:leave-end="transform opacity-0 translate-y-full" class="relative flex min-h-screen items-center justify-center p-4" style="display: none;"> <div x-on:click.stop="" x-trap.noscroll.inert="open" class="relative w-full max-w-sm overflow-y-auto bg-white"> ${renderComponent($$result, "Image", $$Image, { "class": "object-cover w-full aspect-16/10", "width": "1000", "height": "1000", "src": Gif, "alt": "#_" })} <div class="relative p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-medium text-base-900 text-center text-balance" }, { "default": ($$result2) => renderTemplate`
This option is exclusively for supporters
` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600 text-center mt-2 text-balance" }, { "default": ($$result2) => renderTemplate`
Join as a supporter to access this and other exciting features
` })} ${renderComponent($$result, "Link", $$Link, { "size": "base", "variant": "default", "href": "/forms/signup", "class": "w-full justify-center mt-4" }, { "default": ($$result2) => renderTemplate`
Sign up
` })} </div> </div> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/BookmarksModal.astro", void 0);

export { $$BookmarksModal as $ };
