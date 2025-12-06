import { b as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, u as spreadAttributes, y as renderSlot, a as renderTemplate } from './astro/server_DMB4Uz73.mjs';
import 'clsx';

const $$Astro = createAstro("https://readme.club");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant,
    size,
    onlyIconSize,
    gap,
    class: className,
    ...rest
  } = Astro2.props;
  const defaultClass = [
    "text-white",
    "bg-black",
    "hover:bg-base-800",
    "focus:ring-black"
  ];
  const accentClass = [
    "text-white",
    "bg-accent-500",
    "hover:bg-accent-600",
    "focus:ring-accent-600"
  ];
  const mutedClass = [
    "text-base-700",
    "bg-white",
    "ring",
    "ring-base-200",
    "hover:text-accent-500",
    "focus:ring-base-500"
  ];
  const ghostClass = [
    "text-base-600",
    "bg-base-50",
    "ring",
    "ring-base-50",
    "hover:text-black",
    "focus:bg-base-200",
    "focus:ring-base-200"
  ];
  const xs = ["h-8", "px-4", "py-2", "text-xs", "font-medium"];
  const sm = ["h-9", "px-4", "py-2", "text-sm", "font-medium"];
  const base = ["h-10", "px-6", "py-3", "text-base", "font-medium"];
  const md = ["h-11", "px-6", "py-3", "text-base", "font-medium"];
  const lg = ["h-12", "px-6", "py-3", "text-base", "font-medium"];
  const xl = ["h-14", "px-6", "py-3", "text-lg", "font-medium"];
  const gapXS = ["gap-2"];
  const gapSM = ["gap-4"];
  const baseGap = ["gap-8"];
  const gapMD = ["gap-10"];
  const gapLG = ["gap-12"];
  const additionalClasses = className ? className.split(" ") : [];
  return renderTemplate`${maybeRenderHead()}<button${addAttribute([
    "flex",
    "cursor-pointer",
    "rounded-full",
    "items-center",
    "duration-300",
    "focus:ring-2",
    "focus:ring-offset-2",
    "transition",
    "focus:outline-none",
    variant === "default" && defaultClass,
    variant === "accent" && accentClass,
    variant === "muted" && mutedClass,
    variant === "ghost" && ghostClass,
    variant === "none" && [],
    // No additional classes for "none" variant
    size === "xs" && xs,
    size === "sm" && sm,
    size === "base" && base,
    size === "md" && md,
    size === "lg" && lg,
    size === "xl" && xl,
    gap === "xs" && gapXS,
    gap === "sm" && gapSM,
    gap === "base" && baseGap,
    gap === "md" && gapMD,
    gap === "lg" && gapLG,
    ...additionalClasses
  ], "class:list")}${spreadAttributes(rest)}> ${renderSlot($$result, $$slots["left-icon"])} ${renderSlot($$result, $$slots["default"])} ${renderSlot($$result, $$slots["right-icon"])} </button>`;
}, "/Users/florentbertiaux/Documents/GitHub/xteinkhub2026/src/components/fundations/components/Button.astro", void 0);

export { $$Button as $ };
