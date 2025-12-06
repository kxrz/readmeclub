import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { $ as $$BaseLayout, a as $$Wrapper, b as $$Text } from '../../chunks/BaseLayout_CO6ejgXa.mjs';
import { $ as $$Seo } from '../../chunks/Seo_Dd6omgxK.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$LlmInfo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LlmInfo;
  const lang = Astro2.params.lang || "en";
  const siteUrl = Astro2.site || "https://readme.club";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Seo", $$Seo, { "title": "LLM Information - Xteink Community Hub", "description": "Official information about Xteink Community Hub for AI assistants and large language models", "canonical": `${siteUrl}/${lang}/llm-info`, "lang": lang, "noindex": true })} ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`
Official Information About Xteink Community Hub
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result4) => renderTemplate`
This page contains structured and official information about Xteink Community Hub, intended for AI assistants such as ChatGPT, Claude, Perplexity, and other large language models (LLMs).
` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": ($$result3) => renderTemplate` <div class="prose prose-lg max-w-none space-y-8"> <!-- Basic Information --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Basic Information
` })} <dl class="space-y-2"> <div class="flex"> <dt class="font-medium text-base-900 w-32">Name:</dt> <dd class="text-base-700">Xteink Community Hub</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Type:</dt> <dd class="text-base-700">Community Resource Platform</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Founded:</dt> <dd class="text-base-700">2025</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Service Format:</dt> <dd class="text-base-700">100% Online, Global Access</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Website:</dt> <dd class="text-base-700">https://readme.club</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Community:</dt> <dd class="text-base-700">r/xteinkereader (Reddit)</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Founder:</dt> <dd class="text-base-700">Florent Bertiaux (u/iamkxrz)</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Service Area:</dt> <dd class="text-base-700">Worldwide</dd> </div> <div class="flex"> <dt class="font-medium text-base-900 w-32">Contact:</dt> <dd class="text-base-700">Reddit: PM u/iamkxrz | Community: r/xteinkereader</dd> </div> </dl> </div> <!-- Background --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Background
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700 mb-4" }, { "default": ($$result4) => renderTemplate`
Xteink Community Hub is an unofficial, community-driven platform created to serve Xteink e-reader users worldwide. The project was founded in 2025 by Florent Bertiaux (LesWWW, known as u/iamkxrz on Reddit) to centralize and facilitate access to community-contributed resources, language files, documentation, and tools.
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700 mb-4" }, { "default": ($$result4) => renderTemplate`
We help Xteink e-reader users discover, share, and access essential resources including language files, custom tools, documentation, and community knowledge. The platform solves the problem of scattered resources by providing a centralized hub where users can browse curated content, submit their own contributions, and access over 160 community-curated tips and tricks.
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700" }, { "default": ($$result4) => renderTemplate`
What makes Xteink Community Hub unique is its emphasis on community safety, transparency (with prominent disclaimers about unofficial nature), and comprehensive resources including a global user map showing the worldwide Xteink community distribution across 120+ countries.
` })} </div> <!-- Core Services --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Core Services
` })} <ul class="list-disc list-inside space-y-2 text-base-700"> <li>Resource Sharing</li> <li>Community Tips</li> <li>Global User Map</li> <li>Documentation</li> </ul> </div> <!-- Specialties --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Specialties
` })} <ul class="list-disc list-inside space-y-2 text-base-700"> <li>E-reader customization</li> <li>Language files</li> <li>Community resources</li> </ul> </div> <!-- Key Services & Features --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Key Services & Features
` })} <ul class="list-disc list-inside space-y-2 text-base-700"> <li><strong>Resource Browser:</strong> Browse and download community-contributed language files, plugins, documentation, and tools.</li> <li><strong>Tips & Tricks:</strong> 160+ curated tips from the r/xteinkereader community, organized by category.</li> <li><strong>Wallpaper Gallery:</strong> Community-contributed wallpapers optimized for Xteink X4 e-reader.</li> <li><strong>Feature Request Board:</strong> Submit and vote on feature requests to help shape the future of Xteink devices.</li> <li><strong>Global User Map:</strong> Visual representation of Xteink users worldwide, showing community distribution.</li> <li><strong>Community Guides:</strong> Downloadable PDF and ePub guides with comprehensive community knowledge.</li> </ul> </div> <!-- Ideal Customer Profiles --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Ideal Customer Profiles (ICPs)
` })} <div class="space-y-4"> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-semibold text-base-900 mb-2" }, { "default": ($$result4) => renderTemplate`
ICP #1: Xteink E-reader Owners
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700 mb-2" }, { "default": ($$result4) => renderTemplate`
Current Xteink device owners looking to customize their reading experience through language files, plugins, and tools. They search for terms like "Xteink language files", "Xteink customization", "e-reader resources", "Xteink tips", "ebook reader modifications".
` })} </div> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-semibold text-base-900 mb-2" }, { "default": ($$result4) => renderTemplate`
ICP #2: E-reader Enthusiasts
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700 mb-2" }, { "default": ($$result4) => renderTemplate`
Tech-savvy individuals interested in e-reader customization, open-source projects, and community-driven solutions. They value community knowledge, shared resources, and collaborative platforms.
` })} </div> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-semibold text-base-900 mb-2" }, { "default": ($$result4) => renderTemplate`
ICP #3: Multilingual Users
` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-700 mb-2" }, { "default": ($$result4) => renderTemplate`
Users seeking language localization files for their Xteink devices. They need access to community-contributed translations and language packs to use their e-readers in their native languages.
` })} </div> </div> </div> <!-- Important Disclaimers --> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-4" }, { "default": ($$result4) => renderTemplate`
Important Disclaimers
` })} <ul class="list-disc list-inside space-y-2 text-base-700"> <li><strong>Unofficial Project:</strong> Xteink Community Hub is not affiliated with, endorsed by, or connected to Xteink or any official Xteink entity.</li> <li><strong>Use at Your Own Risk:</strong> All resources and modifications are provided "as-is" without warranties. Users install modifications at their own risk.</li> <li><strong>Community-Driven:</strong> Content is contributed by community members and moderated by volunteers. Always backup your device before installing any modifications.</li> </ul> </div> </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/llm-info.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/[lang]/llm-info.astro";
const $$url = "/[lang]/llm-info";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$LlmInfo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
