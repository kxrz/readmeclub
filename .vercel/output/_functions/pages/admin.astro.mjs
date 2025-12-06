import { b as createAstro, c as createComponent, r as renderComponent, d as renderScript, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, a as $$Wrapper, b as $$Text, u as useTranslations } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Button } from '../chunks/Button_B6723hw2.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const adminCookie = Astro2.cookies.get("admin_session");
  const isAuthenticated = adminCookie?.value === "authenticated";
  if (isAuthenticated) {
    return Astro2.redirect("/admin/resources");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("admin.login")}` })} ` })} </section> <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24 max-w-md mx-auto" }, { "default": async ($$result3) => renderTemplate` <form id="admin-login-form" class="space-y-6" x-data="{ loading: false, error: null }"> <div> <label for="password" class="block text-sm font-medium text-base-700 mb-2"> ${t("admin.password")} </label> <input type="password" id="password" name="password" required class="w-full px-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"> </div> <div x-show="error" class="text-red-600 text-sm" style="display: none;"> <span x-text="error"></span> </div> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "accent", "size": "lg", "class": "w-full", "x-bind:disabled": "loading" }, { "default": async ($$result4) => renderTemplate` <span x-show="!loading">${t("admin.login_button")}</span> <span x-show="loading">${t("common.loading")}</span> ` })} </form> ` })} </section> ` })} ${renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/index.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
