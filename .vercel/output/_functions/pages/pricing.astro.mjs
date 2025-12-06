import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { b as $$Text, a as $$Wrapper, $ as $$BaseLayout } from '../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$Button } from '../chunks/Button_B6723hw2.mjs';
export { renderers } from '../renderers.mjs';

const $$Free = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col h-full justify-between bg-base-50 border-base-200"> <div class="p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textXL", "class": "text-base-900 font-semibold hover:text-accent-500 tracking-tight" }, { "default": ($$result2) => renderTemplate`
Completely free access
` })} </div> <div class="p-8 border-t border-base-200 flex flex-col gap-12 mt-50"> <div class="flex items-center gap-2 justify-between"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600 w-1/2" }, { "default": ($$result2) => renderTemplate`
Get limited access to everything.
` })} <span> <span class="text-4xl tracking-tighter font-semibold">$0</span> </span> </div> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/pricing/Free.astro", void 0);

const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      question: "What is a website tool curation platform?",
      answer: "A website tool curation platform is a site that collects and organizes the best tools available online to help users find resources for their specific needs, such as productivity, design, development, or marketing."
    },
    {
      question: "How are the tools selected for curation?",
      answer: "The tools are carefully selected based on their features, user reviews, popularity, and overall utility. Our team evaluates each tool to ensure it meets quality standards and provides value."
    },
    {
      question: "Can I suggest a tool to be added to the curation?",
      answer: "Yes, we encourage user suggestions! You can recommend tools through our 'Suggest a Tool' form. Each submission is reviewed to ensure it aligns with our platform\u2019s focus and quality criteria."
    },
    {
      question: "Are the tools on your website free to use?",
      answer: "Our curated tools include a mix of free, freemium, and paid options. Each tool listing clearly mentions its pricing model to help you decide which fits your needs."
    },
    {
      question: "How do I know if a tool is trustworthy?",
      answer: "We provide detailed descriptions, reviews, and ratings for each tool. Additionally, tools are vetted for reliability, security, and user feedback before being listed on our platform."
    },
    {
      question: "Do you provide tutorials or guides for the tools?",
      answer: "Yes, for many tools, we offer links to official documentation, video tutorials, and user guides to help you get started quickly and efficiently."
    },
    {
      question: "Can I leave reviews or feedback on the tools listed?",
      answer: "Absolutely! We encourage users to leave reviews and feedback on tool pages. This helps others make informed decisions and ensures we maintain a high-quality curation."
    },
    {
      question: "Are there categories to help me find tools more easily?",
      answer: "Yes, tools are categorized by purpose, such as design, development, marketing, or productivity. You can also use our search function to find specific tools quickly."
    },
    {
      question: "Is there a cost to access the curated tools on your website?",
      answer: "Accessing our curated tool lists is completely free. However, individual tools may have their own pricing models, which are indicated in their descriptions."
    },
    {
      question: "Can I share curated tools with others?",
      answer: "Yes, each tool page has sharing options that allow you to easily send links to your colleagues, friends, or team members."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "narrow", "class": "py-6" }, { "default": ($$result2) => renderTemplate` <div class="text-center"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result3) => renderTemplate`
Frequently Asked Questions
` })} ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4  text-base-600 text-balance 2xl:text-xl" }, { "default": ($$result3) => renderTemplate`
Everything you need to know about our platform.
` })} </div> <div class="mt-12"> ${faqs.map((faq) => renderTemplate`<details class="group cursor-pointer"> <summary class="text-sm leading-normal text-base-900 font-medium flex items-center justify-between w-full py-4 text-left select-none hover:text-accent-500 focus:text-accent-500"> ${faq.question} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus size-4 duration-300 ease-out transform group-open:-rotate-45"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5l0 14"></path> <path d="M5 12l14 0"></path> </svg> </summary> <div class="pb-4"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": " text-base-600 text-balance" }, { "default": ($$result3) => renderTemplate`${faq.answer}` })} </div> </details>`)} </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/infopages/Faq.astro", void 0);

const $$Pro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col h-full justify-between bg-base-50 border-base-200"> <div class="p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textXL", "class": "text-base-900 font-semibold hover:text-accent-500 tracking-tight" }, { "default": ($$result2) => renderTemplate`
For the most curioius - <br> tool researchers
` })} </div> <div class="p-8 border-t border-base-200 flex flex-col gap-12 mt-50"> <div class="flex items-center gap-2 justify-between"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600 w-1/2" }, { "default": ($$result2) => renderTemplate`
Get unlimited access to everything and beyond.
` })} <span> <span class="text-lg tracking-tighter"> <span x-show="duration === 'monthly'"> <span x-show="duration === 'monthly'">/m</span> </span><span x-show="duration === 'annual'" style="display: none">
/a</span> </span> <span class="text-4xl tracking-tighter font-semibold" data-monthly="$829" data-annual="$700" x-text="$el.dataset[duration]"></span> </span> </div> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/pricing/Pro.astro", void 0);

const $$Team = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col h-full justify-between bg-base-50 border-base-200"> <div class="p-8"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textXL", "class": "text-base-900 font-semibold hover:text-accent-500 tracking-tight" }, { "default": ($$result2) => renderTemplate`
For super teams - <br> working the next - <br> big thing
` })} </div> <div class="p-8 border-t border-base-200 flex flex-col gap-12 mt-50"> <div class="flex items-center gap-2 justify-between"> ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-600 w-1/2" }, { "default": ($$result2) => renderTemplate`
Get limited access to everything.
` })} <span> <span class="text-lg tracking-tighter"> <span x-show="duration === 'monthly'"> <span x-show="duration === 'monthly'">/m</span> </span><span x-show="duration === 'annual'" style="display: none">
/a</span> </span> <span class="text-4xl tracking-tighter font-semibold" data-monthly="$1229" data-annual="$1000" x-text="$el.dataset[duration]"></span> </span> </div> <button class="size-15 bg-accent-500 flex items-center justify-center text-white rounded-full hover:rotate-45 duration-300 cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 5l0 14"></path><path d="M5 12l14 0"></path></svg> </button> </div> </div>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/pricing/Team.astro", void 0);

const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section x-data="{duration: 'monthly'}"> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col sm:flex-row w-full justify-between"> <div> ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": ($$result4) => renderTemplate`
Membership
` })} </div> <div aria-labelledby="pricing-toggle" class="w-full relative mt-8 ring-1 ring-base-200 ring-offset-2 bg-white overflow-hidden justify-center gap-4 mx-auto lg:mx-0 inline-flex p-1 rounded-full max-w-52 w-ful shadow z-0"> <!-- Sliding background --> <div class="absolute inset-0 bg-base-100 rounded-full transition-transform duration-200 ease-in-out" :class="duration === 'monthly' ? 'w-1/2 translate-x-0' : 'w-1/2 translate-x-full'"></div> <!-- Monthly Pricing Button --> ${renderComponent($$result3, "Button", $$Button, { "id": "monthly-pricing-button", "class": "relative flex items-center justify-center w-full px-2 h-6 text-xs font-medium focus:outline-none transition-colors duration-300 z-10 cursor-pointer", ":class": "duration === 'monthly' ? 'text-accent-600' : ' text-base-600 hover:text-accent-500'", "@click": "duration = 'monthly'", "type": "button", ":aria-pressed": "duration === 'monthly'" }, { "default": ($$result4) => renderTemplate`
Monthly
` })} <!-- Annual Pricing Button --> ${renderComponent($$result3, "Button", $$Button, { "id": "annual-pricing-button", "class": "relative flex items-center justify-center w-full px-2 h-6 text-xs font-medium focus:outline-none transition-colors duration-300 z-10 cursor-pointer", ":class": "duration === 'annual' ? 'text-accent-600' : ' text-base-600 hover:text-accent-500'", "@click": "duration = 'annual'", "type": "button", ":aria-pressed": "duration === 'annual'" }, { "default": ($$result4) => renderTemplate`
Annual
` })} </div> </div> <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-8 lg:grid-cols-3 mx-auto"> ${renderComponent($$result3, "Spot", $$Free, {})} ${renderComponent($$result3, "Sponsor", $$Pro, {})} ${renderComponent($$result3, "Team", $$Team, {})} </div> ` })} </section> ${renderComponent($$result2, "Faq", $$Faq, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/pricing.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
