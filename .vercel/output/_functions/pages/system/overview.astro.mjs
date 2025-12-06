import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate } from '../../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { a as $$Wrapper, b as $$Text, $ as $$BaseLayout } from '../../chunks/BaseLayout_ea5yR0aV.mjs';
import { $ as $$SubmitModal } from '../../chunks/SubmitModal_5LDaOiFM.mjs';
import { $ as $$BookmarksModal } from '../../chunks/BookmarksModal_DhYZevGD.mjs';
import { $ as $$SubscribeModal } from '../../chunks/SubscribeModal_C-Wiq9oA.mjs';
import { $ as $$DeleteAccountModal } from '../../chunks/DeleteAccountModal_DNx1T_Sm.mjs';
import { $ as $$CreateCollectionModal, a as $$EditCollectionModal } from '../../chunks/CreateCollectionModal_B9Vg0M7D.mjs';
import { $ as $$RemoveCollectionModal } from '../../chunks/RemoveCollectionModal_CYyk92-V.mjs';
export { renderers } from '../../renderers.mjs';

const $$Overview$1 = createComponent(($$result, $$props, $$slots) => {
  const pages = [
    {
      title: "Overview",
      categories: [
        {
          title: "Pages",
          links: [
            { href: "/", text: "Home" },
            { href: "/about", text: "About" },
            { href: "/404", text: "404" }
          ]
        },
        {
          title: "Dashboard",
          links: [
            { href: "/dashboard/settings", text: "Settings" },
            { href: "/dashboard/collections", text: "Collections" },
            { href: "/dashboard/collection-details", text: "Collection Details" },
            { href: "/dashboard/submissions", text: "Submissions" },
            { href: "/dashboard/profile", text: "Profile" }
          ]
        },
        {
          title: "Advertise",
          links: [
            { href: "/pricing", text: "Membership" },
            { href: "/advertise", text: "Advertise" }
          ]
        },
        {
          title: "Forms",
          links: [
            { href: "/forms/signin", text: "Sign in" },
            { href: "/forms/signup", text: "Sign up" },
            { href: "/forms/reset", text: "Reset" }
          ]
        },
        {
          title: "System",
          links: [
            { href: "/system/links", text: "Links" },
            { href: "/system/buttons", text: "Buttons" },
            { href: "/system/colors", text: "Colors" },
            { href: "/system/typography", text: "Typography" },
            {
              href: "https://lexingtonthemes.com/legal/license",
              text: "License"
            },
            {
              href: "https://lexingtonthemes.com/legal/support/",
              text: "Support"
            },
            {
              href: "https://lexingtonthemes.com/documentation/",
              text: "Documentation"
            }
          ]
        }
      ]
    },
    {
      title: "Content collections",
      categories: [
        {
          title: "Directory",
          links: [
            { href: "/tools/home", text: "All tools" },
            { href: "/tools/tool/12", text: "Tool details" },
            { href: "/tools/tags", text: "Tag index" },
            { href: "/tools/tags/design", text: "Tag category" },
            { href: "/tools/submit", text: "Submit" }
          ]
        },
        {
          title: "Blog",
          links: [
            { href: "/blog/home", text: "Blog home" },
            { href: "/blog/posts/1", text: "Blog post" },
            { href: "/blog/tags", text: "Tag index" },
            { href: "/blog/tags/Design", text: "Tag category" },
            { href: "/rss.xml", text: "RSS" }
          ]
        },
        {
          title: "Store",
          links: [
            { href: "/store/home", text: "Store Home" },
            { href: "/store/1", text: "Store details" }
          ]
        },
        {
          title: "Utility pages",
          links: [
            { href: "/infopages/terms", text: "Terms" },
            { href: "/infopages/privacy", text: "Privacy" }
          ]
        }
      ]
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section> ${renderComponent($$result, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": ($$result2) => renderTemplate` <div class="grid grid-col-1 lg:grid-cols-2 gap-12"> ${pages.map((section) => renderTemplate`<div class="border-t border-base-200 pt-2 "> <div> ${renderComponent($$result2, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase  text-base-600" }, { "default": ($$result3) => renderTemplate`${section.title}` })} <div class="mt-12  grid grid-cols-2 md:grid-cols-2 gap-8 gap-y-4"> ${section.categories.map((category) => renderTemplate`<div class="flex flex-col gap-2 "> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 font-medium" }, { "default": ($$result3) => renderTemplate`${category.title}` })} <ul role="list"> ${category.links.map((link) => renderTemplate`<li> ${renderComponent($$result2, "Text", $$Text, { "tag": "a", "variant": "textBase", "href": link.href, "class": " text-base-600 hover:text-accent-500" }, { "default": ($$result3) => renderTemplate`${link.text}` })} </li>`)} </ul> </div>`)} </div> </div> </div>`)} <div class="border-t border-base-200 pt-2 col-span-full"> ${renderComponent($$result2, "Text", $$Text, { "tag": "h2", "variant": "textXS", "class": "font-medium uppercase  text-base-600" }, { "default": ($$result3) => renderTemplate`
Widgets
` })} <div class="mt-12"> ${renderComponent($$result2, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-900 font-medium" }, { "default": ($$result3) => renderTemplate`
Modals
` })} <div class="flex flex-wrap gap-4 mt-4"> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Submit
</button> ${renderComponent($$result2, "SubmitModal", $$SubmitModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Bookmarks
</button> ${renderComponent($$result2, "BookmarksModal", $$BookmarksModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
New Collection
</button> ${renderComponent($$result2, "CreateCollectionModal", $$CreateCollectionModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Edit Collection
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Remove collection
</button> ${renderComponent($$result2, "RemoveCollectionModal", $$RemoveCollectionModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Subscribe
</button> ${renderComponent($$result2, "SubscribeModal", $$SubscribeModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Delete account
</button> ${renderComponent($$result2, "DeleteAccountModal", $$DeleteAccountModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Edit account
</button> ${renderComponent($$result2, "EditCollectionModal", $$EditCollectionModal, {})} </div> <div x-data="{ open: false }"> <button class="text-base  text-base-600 hover:text-accent-500" x-on:click="open = true">
Create account
</button> ${renderComponent($$result2, "CreateCollectionModal", $$CreateCollectionModal, {})} </div> </div> </div> </div> </div> ` })} </section>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/system/Overview.astro", void 0);

const $$Overview = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Overview", $$Overview$1, {})} ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/overview.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/system/overview.astro";
const $$url = "/system/overview";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Overview,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
