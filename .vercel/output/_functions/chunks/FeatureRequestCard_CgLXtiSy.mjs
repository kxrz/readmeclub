import { b as createAstro, c as createComponent, m as maybeRenderHead, r as renderComponent, e as addAttribute, d as renderScript, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'piccolore';
import { g as getLangFromUrl, u as useTranslations, b as $$Text } from './BaseLayout_CmF6HVGJ.mjs';

const $$Astro = createAstro("https://readme.club");
const $$FeatureRequestCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$FeatureRequestCard;
  const { feature, hasVoted = false } = Astro2.props;
  const lang = getLangFromUrl(Astro2.url);
  const t = useTranslations(lang);
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    planned: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  };
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-lg border border-base-200 p-6 hover:border-accent-300 hover:shadow-lg transition-all"> <div class="flex items-start justify-between gap-4 mb-4"> <div class="flex-1"> ${renderComponent($$result, "Text", $$Text, { "tag": "h3", "variant": "textLG", "class": "font-semibold text-base-900 mb-2" }, { "default": async ($$result2) => renderTemplate`${feature.title}` })} ${renderComponent($$result, "Text", $$Text, { "tag": "p", "variant": "textSM", "class": "text-base-600 mb-3" }, { "default": async ($$result2) => renderTemplate`${feature.description}` })} </div> <span${addAttribute(`shrink-0 text-xs uppercase px-3 py-1 rounded font-medium ${statusColors[feature.admin_status] || statusColors.pending}`, "class")}> ${t(`board.status.${feature.admin_status}`)} </span> </div> ${feature.tags && feature.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-4"> ${feature.tags.map((tag) => renderTemplate`<span class="text-xs text-base-500 bg-base-50 px-2 py-1 rounded"> ${tag} </span>`)} </div>`} <div class="flex items-center justify-between"> <div class="flex items-center gap-4"> <div class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1z"></path> <path d="M11 9h5a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-5l-4 -7v-5a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2z"></path> </svg> ${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textSM", "class": "text-base-700 font-medium", "data-votes-count": true }, { "default": async ($$result2) => renderTemplate`${t("board.votes", { count: feature.votes_count })}` })} </div> ${feature.reddit_username && renderTemplate`${renderComponent($$result, "Text", $$Text, { "tag": "span", "variant": "textXS", "class": "text-base-500" }, { "default": async ($$result2) => renderTemplate`
@${feature.reddit_username}` })}`} </div> <button${addAttribute(feature.id, "data-feature-id")}${addAttribute(hasVoted, "data-has-voted")}${addAttribute(`vote-button px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${hasVoted ? "bg-accent-100 text-accent-700 cursor-not-allowed" : "bg-accent-500 text-white hover:bg-accent-600"}`, "class")}${addAttribute(hasVoted, "disabled")}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1z"></path> <path d="M11 9h5a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-5l-4 -7v-5a2 2 0 0 1 2 -2h3a2 2 0 0 1 2 2z"></path> </svg> ${hasVoted ? t("board.voted") || "Voted" : t("board.vote")} </button> </div> </div> ${renderScript($$result, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/features/FeatureRequestCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/features/FeatureRequestCard.astro", void 0);

export { $$FeatureRequestCard as $ };
