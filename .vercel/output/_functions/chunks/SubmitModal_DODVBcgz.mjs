import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$Image } from './_astro_assets_BOyCgF7Z.mjs';
import { b as $$Text } from './BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from './Link_Ins73ZxP.mjs';

const Gif = new Proxy({"src":"/_astro/white.DMKzhvaA.gif","width":540,"height":540,"format":"gif"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/images/white.gif";
							}
							
							return target[name];
						}
					});

const $$SubmitModal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div x-show="open" role="dialog" aria-modal="true" style="display: none;" x-id="['modal-title']" aria-labelledby="modal-title-3" :aria-labelledby="$id('modal-title')" x-on:keydown.escape.prevent.stop="open = false" class="fixed inset-0 z-50 w-screen overflow-y-hidden"> <!-- Overlay --> <div x-show="open" x-transition.opacity="" style="display: none;" class="fixed inset-0 bg-base-200/80"></div> <!-- Panel --> <div x-show="open" x-on:click="open = false" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="transform opacity-0 translate-y-full" x-transition:enter-end="transform opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="transform opacity-100 translate-y-0" x-transition:leave-end="transform opacity-0 translate-y-full" class="relative flex min-h-screen items-center justify-center p-4" style="display: none;"> <div x-on:click.stop="" x-trap.noscroll.inert="open" class="relative w-full max-w-sm overflow-y-auto bg-white"> ${renderComponent($$result, "Image", $$Image, { "class": "object-cover w-full aspect-16/10", "width": "1000", "height": "1000", "src": Gif, "alt": "#_" })} <div class="relative p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-medium text-base-900 text-center" }, { "default": ($$result2) => renderTemplate`
Submit a tool
` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "font-medium  text-base-600 text-center mt-2 text-balance" }, { "default": ($$result2) => renderTemplate`
Submit a tool to our collection, wait for approval or <a class="text-black hover:text-accent underline" href="/tools/submit">skip the line</a>.
` })} <form class="mt-4 flex flex-col gap-2"> <div> <label for="name" class="sr-only"> The tool </label> <input id="tool" name="text" type="text" placeholder="Tool name" aria-placeholder="Tool name" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> <div> <label for="tool-url" class="sr-only"> Tool URL </label> <input id="tool-url" name="url" type="url" placeholder="Enter tool URL" aria-placeholder="Enter tool URL" pattern="https?://.+" class="block w-full h-9 px-4 py-2 text-sm text-base-700 duration-300 bg-white border border-transparent rounded-full appearance-none ring-1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> </div> ${renderComponent($$result, "Link", $$Link, { "size": "base", "variant": "default", "href": "/forms/signup", "class": "w-full justify-center" }, { "default": ($$result2) => renderTemplate`
Submit tool
` })} </form> </div> </div> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/SubmitModal.astro", void 0);

export { $$SubmitModal as $ };
