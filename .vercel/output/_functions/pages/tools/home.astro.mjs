import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate, B as defineScriptVars, C as Fragment, e as addAttribute } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { b as $$Text, $ as $$BaseLayout, a as $$Wrapper } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Link } from '../../chunks/Link_Ins73ZxP.mjs';
import { $ as $$Image } from '../../chunks/_astro_assets_BOyCgF7Z.mjs';
import { $ as $$FiltersSidebar, a as $$BigCard } from '../../chunks/BigCard_DIgywpku.mjs';
import 'clsx';
import { g as getCollection } from '../../chunks/_astro_content_DqmQcJki.mjs';
export { renderers } from '../../renderers.mjs';

const Lex = new Proxy({"src":"/_astro/lex.BNWbFr4O.png","width":2146,"height":1288,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/images/lex.png";
							}
							
							return target[name];
						}
					});

const $$SponsorCard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="group-hover:opacity-30 hover:opacity-100 peer hover:peer-hover:opacity-30 duration-300 group"> <div class="overflow-hidden relative"> ${renderComponent($$result, "Image", $$Image, { "width": "500", "height": "500", "src": Lex, "alt": "#_", "class": "object-cover aspect-16/10 w-full" })} <a href="/pricing" title="#_"> <span class="absolute inset-0"></span> </a> </div> <div class="pt-2"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textBase", "class": "font-medium text-base-900" }, { "default": ($$result2) => renderTemplate`Your sponsor card
` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "font-medium  text-base-600" }, { "default": ($$result2) => renderTemplate`Become a sponsor
` })} </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/SponsorCard.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$ToolSearch = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await Promise.all(
    (await getCollection("tools")).map(async (post) => ({
      title: post.data.title,
      tagline: post.data.tagline,
      slug: post.slug
    }))
  );
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="relative "> <button type="button" id="searchButton" class="w-full flex items-center gap-2 py-2 pl-2 pr-4  h-9 px-4 text-sm text-base-700 duration-300 bg-base-100 border border-transparent rounded-full appearance-none ring1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm" aria-label="Search for tools"> <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>\nSearch\n</button> <div id="searchModal" class="fixed inset-0 z-50 overflow-y-auto hidden" role="dialog" aria-modal="true"> <div class="min-h-screen px-4 text-center"> <div class="fixed inset-0 bg-base-950/50 backdrop-blur transition-opacity" id="modalOverlay"></div> <div class="inline-block w-full max-w-2xl px-8 mb-8 mt-12 lg:mt-48 text-left align-middle transition-all transform relative"> <div class="hidden"> <button type="button" id="closeSearch" class="text-base-400 hover: text-base-600 cursor-pointer ml-auto" aria-label="Close search"> <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg> </button> </div> <input type="text" id="searchInput" placeholder="Search posts..." class="w-full py-2 pl-10 pr-4 block h-9 px-4 text-sm text-base-700 duration-300 bg-base-100 border border-transparent rounded-full appearance-none ring1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <div id="searchResults" class="max-h-100 rounded-xl mt-2 overflow-y-auto bg-white  overflow-hidden w-full divide-y divide-base-200 border-y border-base-200 scrollbar-hide"></div> </div> </div> </div> </div> <script>(function(){', '\n  // Wait for the entire page to load before running the script\n  window.addEventListener("load", () => {\n    // Get references to various elements in the search UI\n    const searchButton = document.getElementById("searchButton"); // Button that opens search modal\n    const searchModal = document.getElementById("searchModal"); // Search modal container\n    const modalOverlay = document.getElementById("modalOverlay"); // Overlay that closes modal on click\n    const searchInput = document.getElementById("searchInput"); // Input field for searching\n    const searchResults = document.getElementById("searchResults"); // Container for search results\n    const closeSearch = document.getElementById("closeSearch"); // Button to close search modal\n    // Initialize Fuse.js for fuzzy searching with posts data\n    const fuse = new Fuse(posts, {\n      keys: ["title", "tagline"], // Fields to search within\n      threshold: 0.3, // Controls search sensitivity (lower = more strict)\n      includeMatches: true, // Includes matching results for highlighting\n    });\n    // Hide search results by default\n    searchResults.classList.add("hidden");\n    // Function to open the search modal\n    function openSearch(e) {\n      e.preventDefault(); // Prevent default action (e.g., form submission)\n      e.stopPropagation(); // Stop event from bubbling up the DOM\n      searchModal.classList.remove("hidden"); // Show modal\n      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open\n      setTimeout(() => searchInput.focus(), 100); // Focus input field after a short delay\n    }\n    // Function to close the search modal\n    function closeSearchModal(e) {\n      if (e) {\n        e.preventDefault();\n        e.stopPropagation();\n      }\n      searchModal.classList.add("hidden"); // Hide modal\n      document.body.style.overflow = ""; // Restore scrolling\n      searchInput.value = ""; // Clear search input\n      searchResults.innerHTML = ""; // Clear search results\n      searchResults.classList.add("hidden"); // Ensure results remain hidden\n    }\n    // Function to display search results\n    function renderResults(results) {\n      // If input is empty, hide results\n      if (!searchInput.value.trim()) {\n        searchResults.innerHTML = "";\n        searchResults.classList.add("hidden");\n        return;\n      }\n      // If no results are found, display a message\n      if (results.length === 0) {\n        searchResults.innerHTML = `\n        <div class="p-8">\n            <Text tag="h3" variant="textBase" class="font-medium  text-base-600 font-medium">\n              There\'s nothing here,...\n            </Text>\n        </div>\n        `;\n        searchResults.classList.remove("hidden");\n        return;\n      }\n      // Generate HTML for each search result\n      searchResults.innerHTML = results\n        .map(\n          (result) => `\n            <a href="/tools/tool/${result.item.slug}" class="block p-8 hover:bg-base-100 duration-300 ">\n              <h3  class="font-medium text-sm text-base-900 ">\n                ${result.item.title}\n              </h3>\n              <p  class=" text-base-600 text-xs block">\n                ${result.item.tagline}\n              </p>\n            </a>\n          `\n        )\n        .join(""); // Join all results into a single string of HTML\n      // Make the search results visible\n      searchResults.classList.remove("hidden");\n    }\n    // Add event listeners to open the search modal\n    searchButton.addEventListener("click", openSearch);\n    searchButton.addEventListener("touchend", openSearch); // For mobile devices\n    // Add event listeners to close the search modal\n    closeSearch.addEventListener("click", closeSearchModal);\n    closeSearch.addEventListener("touchend", closeSearchModal);\n    // Close modal when clicking on the overlay (outside the modal)\n    modalOverlay.addEventListener("click", closeSearchModal);\n    modalOverlay.addEventListener("touchend", closeSearchModal);\n    // Listen for user input and perform a search\n    searchInput.addEventListener("input", (e) => {\n      const value = e.target.value.trim(); // Get search input value\n      const results = value ? fuse.search(value) : []; // Perform search only if input isn\'t empty\n      renderResults(results); // Display search results\n    });\n    // Close search modal when the Escape key is pressed\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {\n        closeSearchModal();\n      }\n    });\n  });\n})();<\/script>'], ["", '<div class="relative "> <button type="button" id="searchButton" class="w-full flex items-center gap-2 py-2 pl-2 pr-4  h-9 px-4 text-sm text-base-700 duration-300 bg-base-100 border border-transparent rounded-full appearance-none ring1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:bg-transparent focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm" aria-label="Search for tools"> <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>\nSearch\n</button> <div id="searchModal" class="fixed inset-0 z-50 overflow-y-auto hidden" role="dialog" aria-modal="true"> <div class="min-h-screen px-4 text-center"> <div class="fixed inset-0 bg-base-950/50 backdrop-blur transition-opacity" id="modalOverlay"></div> <div class="inline-block w-full max-w-2xl px-8 mb-8 mt-12 lg:mt-48 text-left align-middle transition-all transform relative"> <div class="hidden"> <button type="button" id="closeSearch" class="text-base-400 hover: text-base-600 cursor-pointer ml-auto" aria-label="Close search"> <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg> </button> </div> <input type="text" id="searchInput" placeholder="Search posts..." class="w-full py-2 pl-10 pr-4 block h-9 px-4 text-sm text-base-700 duration-300 bg-base-100 border border-transparent rounded-full appearance-none ring1 ring-base-200 placeholder-base-400 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"> <div id="searchResults" class="max-h-100 rounded-xl mt-2 overflow-y-auto bg-white  overflow-hidden w-full divide-y divide-base-200 border-y border-base-200 scrollbar-hide"></div> </div> </div> </div> </div> <script>(function(){', '\n  // Wait for the entire page to load before running the script\n  window.addEventListener("load", () => {\n    // Get references to various elements in the search UI\n    const searchButton = document.getElementById("searchButton"); // Button that opens search modal\n    const searchModal = document.getElementById("searchModal"); // Search modal container\n    const modalOverlay = document.getElementById("modalOverlay"); // Overlay that closes modal on click\n    const searchInput = document.getElementById("searchInput"); // Input field for searching\n    const searchResults = document.getElementById("searchResults"); // Container for search results\n    const closeSearch = document.getElementById("closeSearch"); // Button to close search modal\n    // Initialize Fuse.js for fuzzy searching with posts data\n    const fuse = new Fuse(posts, {\n      keys: ["title", "tagline"], // Fields to search within\n      threshold: 0.3, // Controls search sensitivity (lower = more strict)\n      includeMatches: true, // Includes matching results for highlighting\n    });\n    // Hide search results by default\n    searchResults.classList.add("hidden");\n    // Function to open the search modal\n    function openSearch(e) {\n      e.preventDefault(); // Prevent default action (e.g., form submission)\n      e.stopPropagation(); // Stop event from bubbling up the DOM\n      searchModal.classList.remove("hidden"); // Show modal\n      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open\n      setTimeout(() => searchInput.focus(), 100); // Focus input field after a short delay\n    }\n    // Function to close the search modal\n    function closeSearchModal(e) {\n      if (e) {\n        e.preventDefault();\n        e.stopPropagation();\n      }\n      searchModal.classList.add("hidden"); // Hide modal\n      document.body.style.overflow = ""; // Restore scrolling\n      searchInput.value = ""; // Clear search input\n      searchResults.innerHTML = ""; // Clear search results\n      searchResults.classList.add("hidden"); // Ensure results remain hidden\n    }\n    // Function to display search results\n    function renderResults(results) {\n      // If input is empty, hide results\n      if (!searchInput.value.trim()) {\n        searchResults.innerHTML = "";\n        searchResults.classList.add("hidden");\n        return;\n      }\n      // If no results are found, display a message\n      if (results.length === 0) {\n        searchResults.innerHTML = \\`\n        <div class="p-8">\n            <Text tag="h3" variant="textBase" class="font-medium  text-base-600 font-medium">\n              There\'s nothing here,...\n            </Text>\n        </div>\n        \\`;\n        searchResults.classList.remove("hidden");\n        return;\n      }\n      // Generate HTML for each search result\n      searchResults.innerHTML = results\n        .map(\n          (result) => \\`\n            <a href="/tools/tool/\\${result.item.slug}" class="block p-8 hover:bg-base-100 duration-300 ">\n              <h3  class="font-medium text-sm text-base-900 ">\n                \\${result.item.title}\n              </h3>\n              <p  class=" text-base-600 text-xs block">\n                \\${result.item.tagline}\n              </p>\n            </a>\n          \\`\n        )\n        .join(""); // Join all results into a single string of HTML\n      // Make the search results visible\n      searchResults.classList.remove("hidden");\n    }\n    // Add event listeners to open the search modal\n    searchButton.addEventListener("click", openSearch);\n    searchButton.addEventListener("touchend", openSearch); // For mobile devices\n    // Add event listeners to close the search modal\n    closeSearch.addEventListener("click", closeSearchModal);\n    closeSearch.addEventListener("touchend", closeSearchModal);\n    // Close modal when clicking on the overlay (outside the modal)\n    modalOverlay.addEventListener("click", closeSearchModal);\n    modalOverlay.addEventListener("touchend", closeSearchModal);\n    // Listen for user input and perform a search\n    searchInput.addEventListener("input", (e) => {\n      const value = e.target.value.trim(); // Get search input value\n      const results = value ? fuse.search(value) : []; // Perform search only if input isn\'t empty\n      renderResults(results); // Display search results\n    });\n    // Close search modal when the Escape key is pressed\n    document.addEventListener("keydown", (e) => {\n      if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {\n        closeSearchModal();\n      }\n    });\n  });\n})();<\/script>'])), maybeRenderHead(), defineScriptVars({ posts }));
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/tools/ToolSearch.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Home = createComponent(async ($$result, $$props, $$slots) => {
  const alltools = await getCollection("tools");
  const allTags = [...new Set(alltools.flatMap((post) => post.data.tags || []))];
  const sortedTags = allTags.sort((a, b) => a.localeCompare(b));
  return renderTemplate(_a || (_a = __template(["", ` <script>
  function filtersState() {
    return {
      leftDrawerOpen: false,
      // Selected filters
      selectedTags: [],
      selectedCategories: [],
      selectedTypes: [],
      // Helpers to read dataset from a card element
      getTags(el) {
        return (el.dataset.tags || "").split("|").filter(Boolean);
      },
      getCategory(el) {
        return el.dataset.category || "";
      },
      getType(el) {
        return el.dataset.type || "";
      },
      // Core match logic for a given card element
      matches(el) {
        const tags = this.getTags(el);
        const category = this.getCategory(el);
        const type = this.getType(el);
        const tagsOk = this.selectedTags.length === 0 || this.selectedTags.every((t) => tags.includes(t));
        const categoryOk = this.selectedCategories.length === 0 || this.selectedCategories.includes(category);
        const typeOk = this.selectedTypes.length === 0 || this.selectedTypes.includes(type);
        return tagsOk && categoryOk && typeOk;
      },
      // Clear all filters
      clearAll() {
        this.selectedTags = [];
        this.selectedCategories = [];
        this.selectedTypes = [];
      },
    };
  }
  window.filtersState = filtersState;
  // Ensure Alpine picks up the global function if needed after init
  document.addEventListener('alpine:init', () => {
    // no-op; presence ensures function is available when Alpine evaluates x-data
  });
  
<\/script>`])), renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`
Explore all our tools
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`
Here you will find all the tools we have hoarded for you.
` })} <div class="max-w-sm mt-4">${renderComponent($$result3, "ToolSearch", $$ToolSearch, {})}</div> ` })} </section> <section x-data="filtersState()" @keydown.window.escape="open = false"> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": async ($$result3) => renderTemplate` <div class="flex items-center gap-2"> ${renderComponent($$result3, "FiltersSidebar", $$FiltersSidebar, { "tags": sortedTags, "categories": Array.from(new Set(alltools.map((post) => (post.data.details || []).find((d) => d.label === "Category")?.value).filter(Boolean))).sort((a, b) => a.localeCompare(b)), "types": Array.from(new Set(alltools.map((post) => (post.data.details || []).find((d) => d.label === "Type")?.value).filter(Boolean))).sort((a, b) => a.localeCompare(b)) })} <div class="scrollable-content relative flex snap-x snap-proximity gap-2 py-2 px-2 overflow-x-scroll scrollbar-hide"> ${sortedTags.map((tag) => renderTemplate`${renderComponent($$result3, "Link", $$Link, { "size": "xs", "variant": "ghost", "title": tag, "aria-label": tag, "href": `/tools/tags/${tag}`, "class": "capitalize" }, { "default": async ($$result4) => renderTemplate`${tag}` })}`)} </div> </div> <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2"> <!-- Example Content --> ${alltools.map((post, i) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`${// Extract metadata for filtering
  (() => {
    const tags = (post.data.tags || []).join("|");
    const category = (post.data.details || []).find((d) => d.label === "Category")?.value || "";
    const type = (post.data.details || []).find((d) => d.label === "Type")?.value || "";
    return renderTemplate`<div${addAttribute(tags, "data-tags")}${addAttribute(category, "data-category")}${addAttribute(type, "data-type")} x-show="matches($el)"> ${renderComponent($$result4, "BigCard", $$BigCard, { "key": `post-${i}`, "post": post })} </div>`;
  })()}${i === 2 && renderTemplate`${renderComponent($$result4, "SponsorCard", $$SponsorCard, { "key": `sponsor-${i}` })}`}` })}`)} </div> ` })} </section> ` }));
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/home.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/tools/home.astro";
const $$url = "/tools/home";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Home,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
