import { b as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, $ as $$BaseLayout, u as useTranslations, a as $$Wrapper, b as $$Text } from '../chunks/BaseLayout_CmF6HVGJ.mjs';
import { $ as $$Button } from '../chunks/Button_B6723hw2.mjs';
import { $ as $$Seo } from '../chunks/Seo_Dd6omgxK.mjs';
import { $ as $$FeatureRequestCard } from '../chunks/FeatureRequestCard_CgLXtiSy.mjs';
import { s as supabase } from '../chunks/client_DiYgajIf.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://readme.club");
const $$Board = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Board;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const siteUrl = Astro2.site || "https://readme.club";
  const url = Astro2.url;
  const statusFilter = url.searchParams.get("status") || "all";
  let query = supabase.from("feature_requests").select("*").eq("status", "published").eq("hidden", false).order("votes_count", { ascending: false }).order("created_at", { ascending: false });
  if (statusFilter !== "all") {
    query = query.eq("admin_status", statusFilter);
  }
  const { data: features } = await query;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Seo", $$Seo, { "title": `${t("board.title")} - ${t("site.name")}`, "description": t("board.subtitle"), "canonical": `${siteUrl}/board`, "lang": lang })} ${maybeRenderHead()}<section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "hero" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Text", $$Text, { "tag": "h1", "variant": "displaySM", "class": "text-base-900 font-medium 2xl:text-5xl tracking-tight" }, { "default": async ($$result4) => renderTemplate`${t("board.title")}` })} ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "mt-4 text-base-600 text-balance 2xl:text-xl" }, { "default": async ($$result4) => renderTemplate`${t("board.subtitle")}` })} <div class="mt-4"> <a href="#submit-feature-form" class="inline-flex items-center gap-1.5 text-sm text-base-500 hover:text-accent-500 transition-colors"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 5v14"></path> <path d="M5 12h14"></path> </svg> ${t("board.submit")} </a> </div> ` })} </section>  <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6" }, { "default": async ($$result3) => renderTemplate` <div class="flex flex-wrap gap-2"> <a href="/board"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "all" ? "bg-base-900 text-white" : "bg-base-50 text-base-700 hover:bg-base-100 ring-1 ring-base-200"}`, "class")}> ${t("board.filter.all")} </a> <a href="/board?status=pending"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "pending" ? "bg-base-900 text-white" : "bg-base-50 text-base-700 hover:bg-base-100 ring-1 ring-base-200"}`, "class")}> ${t("board.filter.pending")} </a> <a href="/board?status=planned"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "planned" ? "bg-base-900 text-white" : "bg-base-50 text-base-700 hover:bg-base-100 ring-1 ring-base-200"}`, "class")}> ${t("board.filter.planned")} </a> <a href="/board?status=completed"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "completed" ? "bg-base-900 text-white" : "bg-base-50 text-base-700 hover:bg-base-100 ring-1 ring-base-200"}`, "class")}> ${t("board.filter.completed")} </a> <a href="/board?status=rejected"${addAttribute(`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === "rejected" ? "bg-base-900 text-white" : "bg-base-50 text-base-700 hover:bg-base-100 ring-1 ring-base-200"}`, "class")}> ${t("board.filter.rejected")} </a> </div> ` })} </section>  <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": async ($$result3) => renderTemplate`${features && features.length > 0 ? renderTemplate`<div class="space-y-4"> ${features.map((feature) => renderTemplate`${renderComponent($$result3, "FeatureRequestCard", $$FeatureRequestCard, { "feature": feature })}`)} </div>` : renderTemplate`<div class="text-center py-12"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textBase", "class": "text-base-500" }, { "default": async ($$result4) => renderTemplate`${t("board.no_results")}` })} </div>`}` })} </section>  <section> ${renderComponent($$result2, "Wrapper", $$Wrapper, { "variant": "standard", "class": "py-6 pb-24" }, { "default": async ($$result3) => renderTemplate` <div class="max-w-2xl mx-auto"> ${renderComponent($$result3, "Text", $$Text, { "tag": "h2", "variant": "textXL", "class": "font-semibold text-base-900 mb-6" }, { "default": async ($$result4) => renderTemplate`${t("board.submit")}` })} <form id="submit-feature-form" class="space-y-6 bg-white ring-1 ring-base-200 rounded-lg p-6 scroll-mt-24" x-data="{ 
            submitting: false,
            success: false,
            error: null
          }" @submit.prevent="
            submitting = true;
            error = null;
            success = false;
            fetch('/api/features', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: $refs.title.value,
                description: $refs.description.value,
                reddit_username: $refs.reddit_username.value || null,
                tags: $refs.tags.value ? $refs.tags.value.split(',').map(t => t.trim()).filter(t => t) : []
              })
            })
            .then(res => res.json())
            .then(data => {
              submitting = false;
              if (data.success) {
                success = true;
                $refs.title.value = '';
                $refs.description.value = '';
                $refs.reddit_username.value = '';
                $refs.tags.value = '';
                setTimeout(() => window.location.reload(), 1500);
              } else {
                error = data.error || 'Failed to submit';
              }
            })
            .catch(err => {
              submitting = false;
              error = err.message || 'An error occurred';
            })
          "> <div> <label for="title" class="sr-only">${t("board.form.title")}</label> <input type="text" id="title" x-ref="title" required maxlength="80"${addAttribute(t("board.form.title"), "placeholder")} class="w-full px-4 py-2 text-sm text-base-700 bg-white border border-transparent rounded-lg ring-1 ring-base-200 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-2"> </div> <div> <label for="description" class="sr-only">${t("board.form.description")}</label> <textarea id="description" x-ref="description" required maxlength="500" rows="4"${addAttribute(t("board.form.description"), "placeholder")} class="w-full px-4 py-2 text-sm text-base-700 bg-white border border-transparent rounded-lg ring-1 ring-base-200 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-2"></textarea> </div> <div> <label for="reddit_username" class="sr-only">${t("board.form.reddit_username")}</label> <input type="text" id="reddit_username" x-ref="reddit_username" maxlength="30"${addAttribute(t("board.form.reddit_username"), "placeholder")} class="w-full px-4 py-2 text-sm text-base-700 bg-white border border-transparent rounded-lg ring-1 ring-base-200 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-2"> </div> <div> <label for="tags" class="sr-only">${t("board.form.tags")}</label> <input type="text" id="tags" x-ref="tags"${addAttribute(t("board.form.tags"), "placeholder")} class="w-full px-4 py-2 text-sm text-base-700 bg-white border border-transparent rounded-lg ring-1 ring-base-200 focus:border-base-300 focus:outline-none focus:ring-base-500 focus:ring-2"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textXS", "class": "text-base-500 mt-1" }, { "default": async ($$result4) => renderTemplate`${t("common.optional")} - ${t("board.form.tags")} (${t("board.form.tags_hint")})
` })} </div> <div x-show="error" x-cloak class="p-3 bg-red-50 border border-red-200 rounded-lg"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-red-700" }, { "default": async ($$result4) => renderTemplate` <span x-text="error"></span> ` })} </div> <div x-show="success" x-cloak class="p-3 bg-green-50 border border-green-200 rounded-lg"> ${renderComponent($$result3, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-green-700" }, { "default": async ($$result4) => renderTemplate`${t("board.form.success")}` })} </div> <div class="flex justify-end"> ${renderComponent($$result3, "Button", $$Button, { "type": "submit", "variant": "accent", "size": "lg", "x-bind:disabled": "submitting" }, { "default": async ($$result4) => renderTemplate` <span x-show="!submitting">${t("board.form.submit")}</span> <span x-show="submitting">${t("common.loading") || "Submitting..."}</span> ` })} </div> </form> </div> ` })} </section> ` })}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/board.astro", void 0);

const $$file = "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/pages/board.astro";
const $$url = "/board";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Board,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
