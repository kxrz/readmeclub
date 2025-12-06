import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D1nQ2Lln.mjs';
import { manifest } from './manifest_BZya5XFd.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/features.astro.mjs');
const _page4 = () => import('./pages/admin/logout.astro.mjs');
const _page5 = () => import('./pages/admin/resources.astro.mjs');
const _page6 = () => import('./pages/admin/stats.astro.mjs');
const _page7 = () => import('./pages/admin/wallpapers.astro.mjs');
const _page8 = () => import('./pages/admin.astro.mjs');
const _page9 = () => import('./pages/advertise.astro.mjs');
const _page10 = () => import('./pages/api/admin/features/_id_/toggle.astro.mjs');
const _page11 = () => import('./pages/api/admin/features/_id_/update.astro.mjs');
const _page12 = () => import('./pages/api/admin/login.astro.mjs');
const _page13 = () => import('./pages/api/admin/resources/_id_/star.astro.mjs');
const _page14 = () => import('./pages/api/admin/resources/_id_/toggle.astro.mjs');
const _page15 = () => import('./pages/api/admin/resources/_id_/update.astro.mjs');
const _page16 = () => import('./pages/api/admin/resources/_id_.astro.mjs');
const _page17 = () => import('./pages/api/admin/wallpapers/_id_/toggle.astro.mjs');
const _page18 = () => import('./pages/api/admin/wallpapers/_id_/update.astro.mjs');
const _page19 = () => import('./pages/api/admin/wallpapers/_id_.astro.mjs');
const _page20 = () => import('./pages/api/features/_id_/vote.astro.mjs');
const _page21 = () => import('./pages/api/features.astro.mjs');
const _page22 = () => import('./pages/api/guide/epub-v2-download.astro.mjs');
const _page23 = () => import('./pages/api/guide/pdf-v2-download.astro.mjs');
const _page24 = () => import('./pages/api/location/declare.astro.mjs');
const _page25 = () => import('./pages/api/location/stats.astro.mjs');
const _page26 = () => import('./pages/api/og-image.png.astro.mjs');
const _page27 = () => import('./pages/api/resources/upload.astro.mjs');
const _page28 = () => import('./pages/api/resources/_id_/download.astro.mjs');
const _page29 = () => import('./pages/api/resources/_id_/og-image.png.astro.mjs');
const _page30 = () => import('./pages/api/resources/_id_.astro.mjs');
const _page31 = () => import('./pages/api/resources.astro.mjs');
const _page32 = () => import('./pages/api/wallpapers/random.astro.mjs');
const _page33 = () => import('./pages/api/wallpapers/upload.astro.mjs');
const _page34 = () => import('./pages/api/wallpapers/_id_/download.astro.mjs');
const _page35 = () => import('./pages/api/wallpapers/_id_/og-image.png.astro.mjs');
const _page36 = () => import('./pages/api/wallpapers.astro.mjs');
const _page37 = () => import('./pages/blog/home.astro.mjs');
const _page38 = () => import('./pages/blog/posts/_---slug_.astro.mjs');
const _page39 = () => import('./pages/blog/tags/_tag_.astro.mjs');
const _page40 = () => import('./pages/blog/tags.astro.mjs');
const _page41 = () => import('./pages/board.astro.mjs');
const _page42 = () => import('./pages/dashboard/collection-details.astro.mjs');
const _page43 = () => import('./pages/dashboard/collections.astro.mjs');
const _page44 = () => import('./pages/dashboard/profile.astro.mjs');
const _page45 = () => import('./pages/dashboard/settings.astro.mjs');
const _page46 = () => import('./pages/dashboard/submissions.astro.mjs');
const _page47 = () => import('./pages/disclaimer.astro.mjs');
const _page48 = () => import('./pages/fonts.astro.mjs');
const _page49 = () => import('./pages/forms/contact.astro.mjs');
const _page50 = () => import('./pages/forms/reset.astro.mjs');
const _page51 = () => import('./pages/forms/signin.astro.mjs');
const _page52 = () => import('./pages/forms/signup.astro.mjs');
const _page53 = () => import('./pages/guide.astro.mjs');
const _page54 = () => import('./pages/infopages/_---slug_.astro.mjs');
const _page55 = () => import('./pages/llm-info.astro.mjs');
const _page56 = () => import('./pages/location.astro.mjs');
const _page57 = () => import('./pages/pricing.astro.mjs');
const _page58 = () => import('./pages/resources/_id_.astro.mjs');
const _page59 = () => import('./pages/resources.astro.mjs');
const _page60 = () => import('./pages/rss.xml.astro.mjs');
const _page61 = () => import('./pages/sitemap-index.xml.astro.mjs');
const _page62 = () => import('./pages/sitemap.xml.astro.mjs');
const _page63 = () => import('./pages/store/home.astro.mjs');
const _page64 = () => import('./pages/store/_---slug_.astro.mjs');
const _page65 = () => import('./pages/submit.astro.mjs');
const _page66 = () => import('./pages/submit-wallpaper.astro.mjs');
const _page67 = () => import('./pages/system/buttons.astro.mjs');
const _page68 = () => import('./pages/system/colors.astro.mjs');
const _page69 = () => import('./pages/system/links.astro.mjs');
const _page70 = () => import('./pages/system/overview.astro.mjs');
const _page71 = () => import('./pages/system/typography.astro.mjs');
const _page72 = () => import('./pages/tips.astro.mjs');
const _page73 = () => import('./pages/tools/home.astro.mjs');
const _page74 = () => import('./pages/tools/submit.astro.mjs');
const _page75 = () => import('./pages/tools/tags/_tag_.astro.mjs');
const _page76 = () => import('./pages/tools/tags.astro.mjs');
const _page77 = () => import('./pages/tools/tool/_---slug_.astro.mjs');
const _page78 = () => import('./pages/wallpapers/_id_.astro.mjs');
const _page79 = () => import('./pages/wallpapers.astro.mjs');
const _page80 = () => import('./pages/_lang_/board.astro.mjs');
const _page81 = () => import('./pages/_lang_/disclaimer.astro.mjs');
const _page82 = () => import('./pages/_lang_/fonts.astro.mjs');
const _page83 = () => import('./pages/_lang_/guide.astro.mjs');
const _page84 = () => import('./pages/_lang_/llm-info.astro.mjs');
const _page85 = () => import('./pages/_lang_/location.astro.mjs');
const _page86 = () => import('./pages/_lang_/resources/_id_.astro.mjs');
const _page87 = () => import('./pages/_lang_/resources.astro.mjs');
const _page88 = () => import('./pages/_lang_/submit.astro.mjs');
const _page89 = () => import('./pages/_lang_/submit-wallpaper.astro.mjs');
const _page90 = () => import('./pages/_lang_/tips.astro.mjs');
const _page91 = () => import('./pages/_lang_/wallpapers/_id_.astro.mjs');
const _page92 = () => import('./pages/_lang_/wallpapers.astro.mjs');
const _page93 = () => import('./pages/_lang_.astro.mjs');
const _page94 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/features.astro", _page3],
    ["src/pages/admin/logout.ts", _page4],
    ["src/pages/admin/resources.astro", _page5],
    ["src/pages/admin/stats.astro", _page6],
    ["src/pages/admin/wallpapers.astro", _page7],
    ["src/pages/admin/index.astro", _page8],
    ["src/pages/advertise.astro", _page9],
    ["src/pages/api/admin/features/[id]/toggle.ts", _page10],
    ["src/pages/api/admin/features/[id]/update.ts", _page11],
    ["src/pages/api/admin/login.ts", _page12],
    ["src/pages/api/admin/resources/[id]/star.ts", _page13],
    ["src/pages/api/admin/resources/[id]/toggle.ts", _page14],
    ["src/pages/api/admin/resources/[id]/update.ts", _page15],
    ["src/pages/api/admin/resources/[id].ts", _page16],
    ["src/pages/api/admin/wallpapers/[id]/toggle.ts", _page17],
    ["src/pages/api/admin/wallpapers/[id]/update.ts", _page18],
    ["src/pages/api/admin/wallpapers/[id].ts", _page19],
    ["src/pages/api/features/[id]/vote.ts", _page20],
    ["src/pages/api/features/index.ts", _page21],
    ["src/pages/api/guide/epub-v2-download.ts", _page22],
    ["src/pages/api/guide/pdf-v2-download.ts", _page23],
    ["src/pages/api/location/declare.ts", _page24],
    ["src/pages/api/location/stats.ts", _page25],
    ["src/pages/api/og-image.png.ts", _page26],
    ["src/pages/api/resources/upload.ts", _page27],
    ["src/pages/api/resources/[id]/download.ts", _page28],
    ["src/pages/api/resources/[id]/og-image.png.ts", _page29],
    ["src/pages/api/resources/[id].ts", _page30],
    ["src/pages/api/resources/index.ts", _page31],
    ["src/pages/api/wallpapers/random.ts", _page32],
    ["src/pages/api/wallpapers/upload.ts", _page33],
    ["src/pages/api/wallpapers/[id]/download.ts", _page34],
    ["src/pages/api/wallpapers/[id]/og-image.png.ts", _page35],
    ["src/pages/api/wallpapers/index.ts", _page36],
    ["src/pages/blog/home.astro", _page37],
    ["src/pages/blog/posts/[...slug].astro", _page38],
    ["src/pages/blog/tags/[tag].astro", _page39],
    ["src/pages/blog/tags/index.astro", _page40],
    ["src/pages/board.astro", _page41],
    ["src/pages/dashboard/collection-details.astro", _page42],
    ["src/pages/dashboard/collections.astro", _page43],
    ["src/pages/dashboard/profile.astro", _page44],
    ["src/pages/dashboard/settings.astro", _page45],
    ["src/pages/dashboard/submissions.astro", _page46],
    ["src/pages/disclaimer.astro", _page47],
    ["src/pages/fonts.astro", _page48],
    ["src/pages/forms/contact.astro", _page49],
    ["src/pages/forms/reset.astro", _page50],
    ["src/pages/forms/signin.astro", _page51],
    ["src/pages/forms/signup.astro", _page52],
    ["src/pages/guide.astro", _page53],
    ["src/pages/infopages/[...slug].astro", _page54],
    ["src/pages/llm-info.astro", _page55],
    ["src/pages/location.astro", _page56],
    ["src/pages/pricing.astro", _page57],
    ["src/pages/resources/[id].astro", _page58],
    ["src/pages/resources/index.astro", _page59],
    ["src/pages/rss.xml.js", _page60],
    ["src/pages/sitemap-index.xml.ts", _page61],
    ["src/pages/sitemap.xml.ts", _page62],
    ["src/pages/store/home.astro", _page63],
    ["src/pages/store/[...slug].astro", _page64],
    ["src/pages/submit.astro", _page65],
    ["src/pages/submit-wallpaper.astro", _page66],
    ["src/pages/system/buttons.astro", _page67],
    ["src/pages/system/colors.astro", _page68],
    ["src/pages/system/links.astro", _page69],
    ["src/pages/system/overview.astro", _page70],
    ["src/pages/system/typography.astro", _page71],
    ["src/pages/tips/index.astro", _page72],
    ["src/pages/tools/home.astro", _page73],
    ["src/pages/tools/submit.astro", _page74],
    ["src/pages/tools/tags/[tag].astro", _page75],
    ["src/pages/tools/tags/index.astro", _page76],
    ["src/pages/tools/tool/[...slug].astro", _page77],
    ["src/pages/wallpapers/[id].astro", _page78],
    ["src/pages/wallpapers/index.astro", _page79],
    ["src/pages/[lang]/board.astro", _page80],
    ["src/pages/[lang]/disclaimer.astro", _page81],
    ["src/pages/[lang]/fonts.astro", _page82],
    ["src/pages/[lang]/guide.astro", _page83],
    ["src/pages/[lang]/llm-info.astro", _page84],
    ["src/pages/[lang]/location.astro", _page85],
    ["src/pages/[lang]/resources/[id].astro", _page86],
    ["src/pages/[lang]/resources.astro", _page87],
    ["src/pages/[lang]/submit.astro", _page88],
    ["src/pages/[lang]/submit-wallpaper.astro", _page89],
    ["src/pages/[lang]/tips/index.astro", _page90],
    ["src/pages/[lang]/wallpapers/[id].astro", _page91],
    ["src/pages/[lang]/wallpapers/index.astro", _page92],
    ["src/pages/[lang]/index.astro", _page93],
    ["src/pages/index.astro", _page94]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "33481464-6e8b-4634-8230-196daa1fcfc0",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
